import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QrCode, ShieldCheck, Gauge, FileText, Banknote, AlertTriangle } from "lucide-react";

export interface VehicleReportData {
  id: string;
  insuranceExpiry: string;
  challans: number;
  ageYears: number;
  valuationLowLakh: number;
  valuationHighLakh: number;
  riskLevel: "low" | "medium" | "high";
  ownershipCount: number;
  lien: "none" | "active" | "closed";
}

export default function ReportTemplate({ data }: { data: VehicleReportData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vehicle Truth Report</CardTitle>
              <Badge variant={data.riskLevel === "low" ? "secondary" : data.riskLevel === "medium" ? "default" : "destructive"}>
                Risk: {data.riskLevel.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>Report ID: {data.id}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Fact label="Insurance expiry" value={data.insuranceExpiry} icon={<ShieldCheck className="h-4 w-4" />} />
            <Fact label="Total challans" value={String(data.challans)} icon={<FileText className="h-4 w-4" />} />
            <Fact label="Vehicle age" value={`${data.ageYears} yrs`} icon={<Gauge className="h-4 w-4" />} />
            <Fact label="Valuation range" value={`₹${data.valuationLowLakh.toFixed(1)}–₹${data.valuationHighLakh.toFixed(1)} L`} icon={<Banknote className="h-4 w-4" />} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ownership & Lien</CardTitle>
            <CardDescription>Historical events and financial encumbrances</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm grid gap-2">
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Ownership events: {data.ownershipCount}</li>
              <li className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Lien status: {data.lien}</li>
              {data.riskLevel !== "low" && (
                <li className="inline-flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /> Review flags before underwriting or purchase.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shareable Passport</CardTitle>
          <CardDescription>Scan to verify (no PII in QR)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full grid place-items-center rounded-lg border bg-card/50">
            <QrCode className="h-28 w-28 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">
            Signed JWS payload with selected claims. Timestamped and tamper‑evident.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3 bg-card/50">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">{icon} {label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
