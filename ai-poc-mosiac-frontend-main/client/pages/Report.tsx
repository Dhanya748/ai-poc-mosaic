import ReportTemplate, { type VehicleReportData } from "@/components/ReportTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const sampleId = (id && id.trim()) || "MH12AB1234";

  const data: VehicleReportData = useMemo(() => {
    const hash = sampleId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const months = (hash % 10) + 1;
    const low = 2.0 + (hash % 6) * 0.6;
    const high = low + 1.4;
    return {
      id: sampleId,
      insuranceExpiry: `${months.toString().padStart(2, "0")}/20${25 + (hash % 3)}`,
      challans: hash % 5,
      ageYears: 1 + (hash % 12),
      valuationLowLakh: low,
      valuationHighLakh: high,
      riskLevel: (["low", "medium", "high"] as const)[hash % 3],
      ownershipCount: 1 + (hash % 4),
      lien: (["none", "active", "closed"] as const)[hash % 3],
    };
  }, [sampleId]);

  return (
    <section className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Truth Report</h1>
        <div className="flex gap-2">
          <Button asChild variant="secondary"><a href="#" onClick={() => window.print()}>Print</a></Button>
          <Button asChild><a href="/enterprise#apis">Open in Dashboard</a></Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ReportTemplate data={data} />
        </CardContent>
      </Card>
    </section>
  );
}
