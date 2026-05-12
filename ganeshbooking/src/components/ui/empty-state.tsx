import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-amber-950/15 bg-white/70 px-6 py-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}