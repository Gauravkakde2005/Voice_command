export const Loader = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex items-center gap-3 text-sm font-medium text-brand-ink">
    <span className="h-3 w-3 animate-pulse rounded-full bg-brand-coral" />
    <span>{label}</span>
  </div>
);
