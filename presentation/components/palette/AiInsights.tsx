interface AiInsightsProps {
  containerClassName?: string;
  rationale: string | null;
  tags: string[];
}

export const AiInsights = ({ rationale, tags, containerClassName = '' }: AiInsightsProps) => {
  if (!rationale && tags.length === 0) return null;

  return (
    <div className={`mt-2 p-6 rounded-xl bg-neutral-variant/20 border-2 border-neutral-variant/50 space-y-4 ${containerClassName}`}>
      {rationale && (
        <div>
          <h4 className='text-sm font-bold text-primary mb-2'>Why this colors?</h4>
          <p className='text-subtitle text-sm leading-relaxed'>{rationale}</p>
        </div>
      )}
      {tags.length > 0 && (
        <div>
          <h4 className='text-sm font-bold text-primary mb-2'>Tags</h4>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <span key={tag} className='px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium'>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};