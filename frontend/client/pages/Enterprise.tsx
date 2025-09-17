import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Activity, BarChart3, Check, Code2, Copy, Eye, EyeOff, KeyRound, LogIn, MessageSquare, Send, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

interface ChatMessage { role: "user" | "assistant"; content: string }

type ApiTab = "vehicle" | "aadhaar" | "pan";

export default function Enterprise() {
  const [isAuthed, setIsAuthed] = useLocalStorage<boolean>("vehtruth_authed", false);
  const [apiKey, setApiKey] = useLocalStorage<string>("vehtruth_api_key", "");
  const [showKey, setShowKey] = useState(false);
  const maskedKey = useMemo(() => (apiKey ? apiKey.replace(/.(?=.{4})/g, "•") : ""), [apiKey]);

  // API Playground state
  const [activeApi, setActiveApi] = useState<ApiTab>("vehicle");
  const [vehicleId, setVehicleId] = useState("MH12AB1234");
  const [aadhaar, setAadhaar] = useState("1234 5678 9012");
  const [pan, setPan] = useState("ABCDE1234F");
  const [curl, setCurl] = useState("");
  const [resp, setResp] = useState<string>("");
  const [copied, setCopied] = useState<string>("");

  // AI Chat state
  const [aiOpen, setAiOpen] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ask me anything about a vehicle: valuation, risk, insurance, or history." },
  ]);
  const [question, setQuestion] = useState("");

  const generateKey = () => {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const key = "vt_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    setApiKey(key);
    setShowKey(true);
  };

  const copy = async (text: string, tag: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(tag);
    setTimeout(() => setCopied(""), 1200);
  };

  const runVehicle = () => {
    if (!isAuthed) return;
    const url = `/api/vehicles/${vehicleId}/snapshot`;
    const cmd = `curl -X GET '${url}' -H 'Authorization: Bearer ${apiKey || "YOUR_API_KEY"}' -H 'Accept: application/json'`;
    setCurl(cmd);
    const hash = vehicleId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const body = {
      id: vehicleId,
      insurance_expiry: `0${(hash % 9) + 1}/20${25 + (hash % 3)}`,
      challans: hash % 5,
      vehicle_age_years: 1 + (hash % 12),
      valuation_range: { low_lakh: (2 + (hash % 5)).toFixed(1), high_lakh: (3 + (hash % 7)).toFixed(1) },
      risk: ["low", "medium", "high"][hash % 3],
    };
    setResp(JSON.stringify(body, null, 2));
  };

  const runAadhaar = () => {
    if (!isAuthed) return;
    const clean = aadhaar.replace(/\s+/g, "");
    const url = `/api/kyc/aadhaar/verify`;
    const cmd = `curl -X POST '${url}' -H 'Authorization: Bearer ${apiKey || "YOUR_API_KEY"}' -H 'Content-Type: application/json' -d '{"aadhaar":"${clean}"}'`;
    setCurl(cmd);
    const ok = clean.length === 12;
    const body = { aadhaar: `**** **** ${clean.slice(-4)}`, valid: ok, status: ok ? "verified" : "invalid", last_updated: new Date().toISOString() };
    setResp(JSON.stringify(body, null, 2));
  };

  const runPan = () => {
    if (!isAuthed) return;
    const upper = pan.toUpperCase();
    const url = `/api/kyc/pan/verify`;
    const cmd = `curl -X POST '${url}' -H 'Authorization: Bearer ${apiKey || "YOUR_API_KEY"}' -H 'Content-Type: application/json' -d '{"pan":"${upper}"}'`;
    setCurl(cmd);
    const ok = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(upper);
    const body = { pan: `${upper.slice(0,5)}****${upper.slice(-1)}`, valid: ok, name_match_score: ok ? 0.92 : 0.0 };
    setResp(JSON.stringify(body, null, 2));
  };

  const sendQuestion = () => {
    const q = question.trim();
    if (!q) return;
    const next: ChatMessage[] = [...chat, { role: "user", content: q }];
    const answer = makeAnswer(q, vehicleId);
    next.push({ role: "assistant", content: answer });
    setChat(next);
    setQuestion("");
  };

  return (
    <section className="container py-12 space-y-10">
      <div className="max-w-3xl animate-fade-in-up">
        <Badge variant="secondary">Dashboard</Badge>
        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">Vehicle Truth — Trust APIs & Console</h1>
        <p className="mt-4 text-muted-foreground">Login required for all snapshots. Use the playground with your API key. Bulk verification is intentionally excluded.</p>
      </div>

      {!isAuthed && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LogIn className="h-5 w-5" /> Sign in to continue</CardTitle>
            <CardDescription>Access snapshots, API playground, and usage metrics.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button onClick={() => setIsAuthed(true)} className="btn-gradient">Sign in</Button>
            </div>
            <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
              <p>Why login?</p>
              <ul className="mt-2 list-disc pl-4 space-y-1">
                <li>Consent + audit trail</li>
                <li>Per-key quotas</li>
                <li>Abuse protection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Card id="apis" className={cn(!isAuthed && "opacity-60 pointer-events-none")}> 
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5" /> API Playground</CardTitle>
          <CardDescription>Select an API, compose a curl, and inspect the JSON response. Keep your API key secret.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input value={showKey ? apiKey : maskedKey} readOnly placeholder="Generate a key below" />
              <Button variant="secondary" onClick={() => setShowKey((s) => !s)}>{showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
              <Button variant="secondary" onClick={() => copy(apiKey, "key")}>{copied === "key" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Header: Authorization: Bearer {showKey ? apiKey || "<your-key>" : maskedKey || "<your-key>"}</p>
          </div>

          <Tabs value={activeApi} onValueChange={(v) => setActiveApi(v as ApiTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="aadhaar">Aadhaar</TabsTrigger>
              <TabsTrigger value="pan">PAN</TabsTrigger>
            </TabsList>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div className="grid gap-4">
                {activeApi === "vehicle" && (
                  <div className="grid gap-3">
                    <div>
                      <Label>Vehicle Number / VIN</Label>
                      <Input value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={runVehicle}>Run</Button>
                      <Button variant="secondary" onClick={() => { setCurl(""); setResp(""); }}>Clear</Button>
                      <Button asChild variant="secondary"><Link to={`/report/${encodeURIComponent(vehicleId)}`}>Open Report</Link></Button>
                    </div>
                    <div>
                      <Label>curl</Label>
                      <pre className="mt-2 rounded-lg bg-secondary p-3 text-xs overflow-auto"><code>{curl || "curl will appear here after you run"}</code></pre>
                    </div>
                  </div>
                )}
                {activeApi === "aadhaar" && (
                  <div className="grid gap-3">
                    <div>
                      <Label>Aadhaar Number</Label>
                      <Input value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={runAadhaar}>Run</Button>
                      <Button variant="secondary" onClick={() => { setCurl(""); setResp(""); }}>Clear</Button>
                    </div>
                    <div>
                      <Label>curl</Label>
                      <pre className="mt-2 rounded-lg bg-secondary p-3 text-xs overflow-auto"><code>{curl || "curl will appear here after you run"}</code></pre>
                    </div>
                  </div>
                )}
                {activeApi === "pan" && (
                  <div className="grid gap-3">
                    <div>
                      <Label>PAN Number</Label>
                      <Input value={pan} onChange={(e) => setPan(e.target.value)} />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={runPan}>Run</Button>
                      <Button variant="secondary" onClick={() => { setCurl(""); setResp(""); }}>Clear</Button>
                    </div>
                    <div>
                      <Label>curl</Label>
                      <pre className="mt-2 rounded-lg bg-secondary p-3 text-xs overflow-auto"><code>{curl || "curl will appear here after you run"}</code></pre>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Response</Label>
                <pre className="mt-2 rounded-lg bg-secondary p-3 text-xs overflow-auto min-h-[220px]"><code>{resp || "{\n  \"message\": \"Run the playground to see a response.\"\n}"}</code></pre>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Generate API Key</CardTitle>
            <CardDescription>Create a new key for the playground and integrations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex gap-2">
              <Input value={showKey ? apiKey : maskedKey} readOnly placeholder="No key yet" />
              <Button onClick={generateKey} className="btn-gradient">Generate</Button>
              <Button variant="secondary" onClick={() => copy(apiKey, "key2")}>{copied === "key2" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Keys are stored locally for demo purposes. Rotate regularly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>View the default report template for a vehicle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="text-sm text-muted-foreground">Preview report for: <span className="font-medium text-foreground">{vehicleId}</span></div>
            <div className="flex gap-3">
              <Button asChild><Link to={`/report/${encodeURIComponent(vehicleId)}`}>Open Report</Link></Button>
              <Button asChild variant="secondary"><Link to="/report">Sample Report</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Portfolio Insights</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>Fleet age, risk mix, regional breakdown.</CardDescription>
            <Button className="mt-4 w-full" disabled>
              View Insights
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">API Usage & Billing</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>Requests, errors, quotas, invoices.</CardDescription>
            <Button className="mt-4 w-full" disabled>
              Open Metrics
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">API Docs</CardTitle>
            <Code2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription>OpenAPI, guides, SDKs.</CardDescription>
            <Button className="mt-4 w-full" disabled>
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat trigger */}
      <Button onClick={() => setAiOpen(true)} className="fixed bottom-6 right-6 shadow-lg inline-flex items-center gap-2"><MessageSquare className="h-4 w-4" /> AI Chat</Button>
      <Sheet open={aiOpen} onOpenChange={setAiOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Ask AI about vehicles</SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid gap-3 h-[80vh]">
            <div className="flex-1 overflow-auto rounded-md border p-3 bg-card/50 space-y-3">
              {chat.map((m, i) => (
                <div key={i} className={cn("text-sm", m.role === "user" ? "text-foreground" : "text-muted-foreground")}>{m.role === "user" ? "You: " : "AI: "}{m.content}</div>
              ))}
            </div>
            <div className="grid gap-2">
              <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`e.g. What's the valuation and risk for ${vehicleId}?`} />
              <div className="flex justify-end">
                <Button onClick={sendQuestion} className="inline-flex items-center gap-2"><Send className="h-4 w-4" /> Ask</Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function makeAnswer(q: string, vehicleId: string) {
  const base = vehicleId || "MH12AB1234";
  const hash = base.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const risk = ["low", "medium", "high"][hash % 3];
  const low = 2 + (hash % 5);
  const high = low + 1.2;
  if (/risk|safe|accident/i.test(q)) return `Estimated risk for ${base} looks ${risk}. Check challans and service history before underwriting.`;
  if (/valuation|price|worth/i.test(q)) return `Indicative valuation for ${base}: ₹${low.toFixed(1)}–₹${high.toFixed(1)} L given age and usage patterns.`;
  if (/insurance|expiry/i.test(q)) return `Insurance likely expires around 0${(hash % 9) + 1}/20${25 + (hash % 3)} for ${base}.`;
  return `For ${base}, you can ask about valuation, risk, insurance, ownership, or lien status.`;
}
