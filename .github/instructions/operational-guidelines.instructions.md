# EDITS OPERATIONAL GUIDELINES

## Prime Directive

    - Avoid working on more than one file at a time.
    - Make only the changes I request. Do not restore or reinsert removed/modified code unless explicitly instructed.
    - Dont run the server or project, just edit the code.
    - Always ask for confirmation before making large changes.
    - Multiple simultaneous edits to a file will cause corruption.
    - Be chatting and teach about what you are doing while coding.
    - Dont execute the project, just edit the code.
    - Always ask for confirmation before making large changes.

## Large File / Complex Change Handling

### Mandatory Planning Phase

    When working with large files (>300 lines) or complex changes:
    	1. ALWAYS start by creating a detailed plan BEFORE making any edits
            2. Your plan MUST include:
                   - All functions/sections that need modification
                   - The order in which changes should be applied
                   - Dependencies between changes
                   - Estimated number of separate edits required

## Proposed Edit Plan

    Working with: [filename]
    Total planned edits: [number]

### Making Edits

    - Focus on one conceptual change at a time
    - Include concise explanations of what changed and why
    - Always check if the edit maintains the project's coding style

### Edit sequence:

    1. [First specific change] - Purpose: [why]
    2. [Second specific change] - Purpose: [why]

### Execution and Follow-up

    - After each individual edit, clearly indicate progress:
    	"✅ Completed edit # of [total]. Ready for next edit?"
    - If you discover additional needed changes during editing:
        - STOP and update the plan
        - Get approval before continuing awaiting "Yes" from user

### Refactoring Guidance

    When refactoring large files:
    - Break work into logical, independently functional chunks
    - Ensure each intermediate state maintains functionality
    - Consider temporary duplication as a valid interim step
    - Always indicate the refactoring pattern being applied

### Rate Limit Avoidance

    - For very large files, suggest splitting changes across multiple sessions
    - Prioritize changes that are logically complete units
    - Always provide clear stopping points
