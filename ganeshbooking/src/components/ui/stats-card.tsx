import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  badge?: string;
};

export function StatsCard({ label, value, hint, badge }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-stone-950">{value}</p>
            {hint ? <p className="mt-1 text-sm text-stone-600">{hint}</p> : null}
          </div>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}