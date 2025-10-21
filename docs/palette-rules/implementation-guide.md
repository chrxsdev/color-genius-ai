# Implementation Guide: Color Diversity System

## Architecture Overview

The Color Diversity System is implemented as a set of private methods within the `PaletteGenerator` class, providing automated quality control for AI-generated color palettes.

## Core Components

### 1. Distance Calculation Engine

**Method:** `calculateColorDistance(hsl1, hsl2)`

**Purpose:** Compute perceptual distance between two colors in HSL space

**Algorithm:**
```
1. Calculate hue difference (accounting for circularity)
2. Calculate saturation difference (absolute value)
3. Calculate lightness difference (absolute value)
4. Normalize all values to 0-1 range
5. Apply weights (hue: 2.0, saturation: 1.0, lightness: 1.0)
6. Compute weighted Euclidean distance
7. Return normalized distance value
```

**Key Implementation Details:**
- Hue circularity: `if (hueDiff > 180) hueDiff = 360 - hueDiff`
- Normalization factors: H/180, S/100, L/100
- Result range: 0.0 (identical) to ~3.0 (maximum difference)

### 2. Threshold Management

**Method:** `getMinimumDistance(harmony)`

**Purpose:** Return harmony-specific minimum distance thresholds

**Implementation:**
```typescript
const thresholds: Record<string, number> = {
  monochromatic: 0.25,
  analogous: 0.35,
  complementary: 0.30,
  triadic: 0.28,
  tetradic: 0.25,
  'split-complementary': 0.30,
};
return thresholds[harmony] ?? 0.30;
```

**Design Rationale:**
- Higher thresholds for limited-hue harmonies (monochromatic)
- Lower thresholds for multi-hue harmonies (tetradic)
- Default fallback ensures safety

### 3. Similarity Detection

**Method:** `findSimilarColors(colors, harmony)`

**Purpose:** Identify all pairs of colors that violate minimum distance

**Algorithm:**
```
1. Get minimum distance threshold for harmony
2. Initialize empty similar pairs array
3. For each color i:
   4. For each subsequent color j > i:
      5. Calculate distance between i and j
      6. If distance < threshold:
         7. Add pair [i, j] to similar pairs
8. Return all similar pairs
```

**Complexity:** O(n²) where n is color count

**Output Format:** Array of index tuples `[[0, 2], [1, 3]]`

### 4. Color Adjustment Engine

**Method:** `adjustColor(color, targetColor, harmony)`

**Purpose:** Modify a color to increase distance from another color

**Monochromatic Strategy:**
```
IF harmony is 'monochromatic':
  IF saturation difference < 20:
    IF color.s > 50:
      increase saturation by 15 (max 95)
    ELSE:
      decrease saturation by 15 (min 10)
  
  IF lightness difference < 20:
    IF color.l > 50:
      increase lightness by 15 (max 90)
    ELSE:
      decrease lightness by 15 (min 15)
```

**Other Harmonies Strategy:**
```
IF harmony is NOT 'monochromatic':
  Calculate hue difference (with circularity)
  
  IF hue difference < 20:
    Determine shift direction (away from target)
    Shift hue by 25° (with modulo 360)
  
  IF saturation difference < 15:
    Adjust saturation ±12 (bounds: 15-95)
  
  IF lightness difference < 15:
    Adjust lightness ±12 (bounds: 20-85)
```

**Key Features:**
- Harmony-aware adjustments
- Bidirectional adjustments (increase or decrease based on position)
- Bounds protection to prevent invalid HSL values
- Returns new HSL object (immutable approach)

### 5. Orchestration Layer

**Method:** `enforceColorDiversity(colors, harmony)`

**Purpose:** Main validation and adjustment loop

**Algorithm:**
```
1. Set maximum iterations = 10
2. Initialize iteration counter = 0
3. Copy input colors array

4. WHILE iteration < maxIterations:
   5. Find all similar color pairs
   
   6. IF no similar pairs found:
      7. Break (success - all colors are distinct)
   
   8. Initialize set of adjusted indices
   
   9. FOR EACH similar pair [index1, index2]:
      10. IF index2 not yet adjusted this iteration:
          11. Get target color from index1
          12. Adjust color at index2
          13. Update HSL values
          14. Regenerate HEX from new HSL
          15. Mark index2 as adjusted
   
   16. Increment iteration counter

17. Return adjusted colors
```

**Design Decisions:**
- Maximum 10 iterations prevents infinite loops
- Only adjust second color in each pair (stability)
- Track adjusted indices to avoid redundant work
- Regenerate HEX to maintain consistency
- Return best available if max iterations reached

## Integration Flow

### AI Generation Pipeline

```
User Request
    ↓
Sanitize Input
    ↓
Build System Prompt (with enhanced rules)
    ↓
Call AI Model (Gemini 2.0 Flash)
    ↓
Receive Generated Colors
    ↓
→ enforceColorDiversity() ←  [Validation Layer]
    ↓
Return Validated Palette
```

### Color Update Process

```
Original Color Object:
{
  name: "Ocean Blue",
  hex: "#3498DB",
  hsl: { h: 204, s: 70, l: 53 }
}
    ↓
Adjustment Needed
    ↓
adjustColor() modifies HSL
    ↓
New HSL: { h: 229, s: 82, l: 53 }
    ↓
hslToHex() regenerates HEX
    ↓
Updated Color Object:
{
  name: "Ocean Blue",
  hex: "#4169E1",
  hsl: { h: 229, s: 82, l: 53 }
}
```

## Dependencies

### External Libraries

**color** (v5.0.2)
- HSL to HEX conversion
- Input validation and normalization
- Color space transformations

```typescript
import { hslToHex } from '@/utils/color-conversions/code-color-conversions';
```

### Internal Modules

**PaletteSchema** (Zod validation)
- Validates AI response structure
- Ensures type safety
- Catches malformed data

**PaletteResponse** (TypeScript type)
- Defines expected output format
- Includes metadata fields
- Type-safe palette handling

## Configuration

### Adjustable Parameters

**Distance Weights:**
```typescript
private readonly HUE_WEIGHT = 2.0;
private readonly SATURATION_WEIGHT = 1.0;
private readonly LIGHTNESS_WEIGHT = 1.0;
```

**Minimum Thresholds:**
```typescript
monochromatic: 0.25
analogous: 0.35
complementary: 0.30
triadic: 0.28
tetradic: 0.25
'split-complementary': 0.30
```

**Adjustment Magnitudes:**
```typescript
Monochromatic: ±15 points (S/L)
Other Harmonies: ±25° (H), ±12 points (S/L)
```

**Iteration Limit:**
```typescript
const maxIterations = 10;
```

### Bounds Protection

**Hue:** 0-360° (circular, modulo arithmetic)
**Saturation:** 10-95% (avoid pure gray and oversaturation)
**Lightness:** 15-90% (avoid pure black and pure white)

## Error Handling

### Fallback Strategy

If AI generation fails entirely:
```typescript
private getStaticFallback(): PaletteResponse
```
Returns a pre-defined 5-color gradient palette with proper structure.

### Validation Timeout

If max iterations reached without full convergence:
- Return best available palette
- Majority of colors will still meet requirements
- Graceful degradation (acceptable quality)

### Invalid Input Protection

Sanitization layer prevents:
- Prompt injection attacks
- Code execution attempts
- Excessively long inputs
- Invalid harmony types
- Out-of-range color counts

## Testing Recommendations

### Unit Tests

**Distance Calculation:**
- Test hue circularity (359° vs 1° = 2° difference)
- Test identical colors (distance = 0)
- Test maximum difference colors
- Test weight application

**Threshold Retrieval:**
- Test all harmony types
- Test default fallback
- Test invalid harmony types

**Color Adjustment:**
- Test monochromatic adjustments (hue preserved)
- Test multi-hue adjustments (hue shifts)
- Test bounds protection (no invalid values)
- Test bidirectional adjustments

**Similarity Detection:**
- Test with all similar colors
- Test with all distinct colors
- Test mixed scenarios
- Test different palette sizes

### Integration Tests

**Full Pipeline:**
- Generate palette with each harmony type
- Verify all colors pass distance check
- Verify HEX/HSL consistency
- Measure adjustment frequency
- Test multiple generations (consistency)

**Edge Cases:**
- Minimum color count (3)
- Maximum color count (8)
- All colors nearly identical (stress test)
- All colors very different (no adjustments needed)

### Performance Tests

**Benchmark Targets:**
- Detection: < 0.1ms for 8 colors
- Adjustment: < 0.05ms per color
- Full validation: < 1ms for 5 colors
- End-to-end: < 3 seconds (including AI)

## Monitoring

### Quality Metrics

Track and log:
- Percentage of palettes needing adjustment
- Average number of iterations
- Average number of colors adjusted per palette
- Distribution of adjustment magnitudes
- Harmony-specific statistics

### Performance Metrics

Monitor:
- Validation execution time
- AI response time
- Total generation time
- Memory usage
- Error rates

## Maintenance

### Code Review Checklist

- [ ] Bounds checking for all HSL modifications
- [ ] Hue circularity handled correctly
- [ ] Immutable data patterns (no mutations)
- [ ] Type safety maintained
- [ ] Error handling present
- [ ] Performance considerations
- [ ] Documentation updated

### Refactoring Opportunities

**Potential Improvements:**
- Extract distance calculation to separate utility
- Make weights configurable per harmony
- Add user-adjustable quality levels
- Implement Delta-E 2000 distance metric
- Add caching for repeated calculations
- Parallel processing for large palettes

## Version History

**v1.0.0** (Current)
- Initial implementation with O(n²) detection
- Six harmony types supported
- Weighted Euclidean distance metric
- Maximum 10 iterations
- Integration with `color` package

**Planned v1.1.0**
- User-configurable diversity levels
- Accessibility contrast checker
- Performance optimizations
- Extended harmony types

## References

### Color Theory
- HSL color space specification
- Color harmony principles
- Perceptual color distance metrics

### Implementation Resources
- `color` npm package documentation
- TypeScript best practices
- Zod schema validation
- Next.js API routes

## Support

For questions or issues related to the Color Diversity System:
- Review this documentation first
- Check unit tests for usage examples
- Consult the main design document
- Open an issue with reproduction steps
