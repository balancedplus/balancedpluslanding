import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StatCard({ title, value, description }) {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}
