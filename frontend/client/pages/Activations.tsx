import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Stepper from "@/components/ui/Stepper";
import { 
  Rocket, 
  Mail, 
  MessageSquare, 
  Bell, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  Users,
  Target,
  Server,
  Flame
} from "lucide-react";
import { toast } from "sonner";
import SuccessModal from "@/components/ui/SuccessModal";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "in-app";
  status: "pending" | "approved" | "running" | "paused" | "completed";
  segment: string;
  estimatedReach: number;
  goal: string;
  createdAt: string;
  scheduledFor?: string;
}

interface Decision {
  id: string;
  customerId: string;
  action: string;
  channel: string;
  confidence: number;
  timestamp: string;
  outcome?: "sent" | "delivered" | "opened" | "clicked";
}

export default function Activations() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: "camp-1",
      name: "Win-back Email Campaign",
      type: "email",
      status: "pending",
      segment: "Lapsed Customers",
      estimatedReach: 24000,
      goal: "Reduce churn",
      createdAt: "2 hours ago",
      scheduledFor: "Tomorrow 9:00 AM"
    },
    {
      id: "camp-2", 
      name: "VIP Upsell Push",
      type: "push",
      status: "running",
      segment: "High-Value VIPs",
      estimatedReach: 850,
      goal: "Increase AOV",
      createdAt: "1 day ago"
    },
    {
      id: "camp-3",
      name: "Cart Recovery SMS",
      type: "sms", 
      status: "approved",
      segment: "Cart Abandoners",
      estimatedReach: 12500,
      goal: "Drive conversions",
      createdAt: "3 hours ago",
      scheduledFor: "Today 6:00 PM"
    }
  ]);

  const [recentDecisions] = useState<Decision[]>([
    { id: "dec-1", customerId: "user_123", action: "Send discount email", channel: "email", confidence: 0.89, timestamp: "2 min ago", outcome: "sent" },
    { id: "dec-2", customerId: "user_456", action: "Push notification", channel: "push", confidence: 0.76, timestamp: "5 min ago", outcome: "delivered" },
    { id: "dec-3", customerId: "user_789", action: "Suppress messaging", channel: "none", confidence: 0.92, timestamp: "8 min ago" },
    { id: "dec-4", customerId: "user_321", action: "SMS reminder", channel: "sms", confidence: 0.84, timestamp: "12 min ago", outcome: "opened" },
    { id: "dec-5", customerId: "user_654", action: "In-app tooltip", channel: "in-app", confidence: 0.71, timestamp: "15 min ago", outcome: "clicked" },
  ]);

  const [activationStep, setActivationStep] = useState<number>(1);
  const activationSteps = ["Select Target Audience", "Select Destination", "Schedule", "Finalize"];
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Wizard selections
  const audiences = [
    { audience: "Customer Win back", segment: "Lapsed Customers", count: 24000 },
    { audience: "VIP Upsell", segment: "High-Value VIPs", count: 850 },
    { audience: "Cart Recovery", segment: "Cart Abandoners", count: 12500 },
  ];
  const [selectedAudienceIdx, setSelectedAudienceIdx] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [destinationConfig, setDestinationConfig] = useState<Record<string, string>>({});
  const [scheduleType, setScheduleType] = useState<'Daily' | 'Once' | 'Every'>('Daily');
  const [scheduleEveryN, setScheduleEveryN] = useState(1);
  const [scheduleTime, setScheduleTime] = useState({ hour: '03', minute: '00', ampm: 'AM' });
  const [excludePrevious, setExcludePrevious] = useState(true);

  const scheduledForText = () => {
    const time = `${scheduleTime.hour}:${scheduleTime.minute} ${scheduleTime.ampm}`;
    if (scheduleType === 'Once') return `Once at ${time}`;
    if (scheduleType === 'Every') return `Every ${scheduleEveryN} day(s) at ${time}`;
    return `Daily at ${time}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "running": return "bg-blue-100 text-blue-800";
      case "paused": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <MessageSquare className="h-4 w-4" />;
      case "push": return <Bell className="h-4 w-4" />;
      case "in-app": return <Target className="h-4 w-4" />;
      default: return <Rocket className="h-4 w-4" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "sent": return "text-blue-600";
      case "delivered": return "text-green-600";
      case "opened": return "text-purple-600";
      case "clicked": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const handleApprove = (campaignId: string) => {
    toast.success("Campaign approved and scheduled");
  };

  const handleReject = (campaignId: string) => {
    toast.error("Campaign rejected");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* High-level flow progress: Segment → Audience → Activation */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
        <Stepper currentStep={3} steps={["Segment", "Audience", "Activation"]} />
      </div>

      {/* Activation process stepper */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <Stepper currentStep={activationStep} steps={activationSteps} />
      </div>

      {/* Step content */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        {activationStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Target Audience</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {audiences.map((a, idx) => (
                <button key={a.segment} onClick={() => setSelectedAudienceIdx(idx)} className={`p-4 border rounded-lg text-left hover:shadow ${selectedAudienceIdx===idx? 'border-purple-600 ring-1 ring-purple-600 bg-purple-50':'border-gray-200 bg-white'}`}>
                  <div className="text-sm text-gray-500">Audience</div>
                  <div className="font-semibold text-gray-900">{a.audience}</div>
                  <div className="mt-2 text-sm text-gray-500">Segment</div>
                  <div className="font-medium text-gray-800">{a.segment}</div>
                  <div className="mt-3 text-xs text-gray-500">Total Count</div>
                  <div className="text-2xl font-bold text-purple-600">{a.count.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {activationStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Destination</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                {
                  name: 'SendGrid',
                  logo: (
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-[#1a73e8]/10">
                      <Mail className="h-5 w-5 text-[#1a73e8]" />
                    </div>
                  )
                },
                {
                  name: 'Twilio SMS',
                  logo: (
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-[#F22F46]/10">
                      <MessageSquare className="h-5 w-5 text-[#F22F46]" />
                    </div>
                  )
                },
                {
                  name: 'Google Ads',
                  logo: (
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-[#1a73e8]/10">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                        <path fill="#1a73e8" d="M10 4l6.5 11.5a2 2 0 11-3.464 2L6.536 6a2 2 0 113.464-2z" />
                        <circle cx="17.5" cy="17.5" r="2.5" fill="#34a853" />
                        <path fill="#fabb05" d="M7 6h6v4H7z" />
                      </svg>
                    </div>
                  )
                },
                {
                  name: 'SFTP Channel',
                  logo: (
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-sky-600/10">
                      <Server className="h-5 w-5 text-sky-600" />
                    </div>
                  )
                },
                {
                  name: 'Braze',
                  logo: (
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-orange-500/10">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                  )
                }
              ].map(({ name, logo }) => (
                <button key={name} onClick={() => setSelectedDestination(name)} className={`p-4 border rounded-lg text-left hover:shadow ${selectedDestination===name? 'border-purple-600 ring-1 ring-purple-600 bg-purple-50':'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    {logo}
                    <div>
                      <div className="font-semibold text-gray-900">{name}</div>
                      <div className="text-xs text-gray-500 mt-1">Delivery Method</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedDestination && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Configure {selectedDestination}</h4>
                {selectedDestination === 'Google Ads' && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Customer Account ID</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['ga_account']||''} onChange={(e)=>setDestinationConfig(v=>({...v, ga_account:e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Conversion Action</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['ga_action']||''} onChange={(e)=>setDestinationConfig(v=>({...v, ga_action:e.target.value}))} />
                    </div>
                  </div>
                )}
                {selectedDestination === 'SendGrid' && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Sender Domain</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['sg_domain']||''} onChange={(e)=>setDestinationConfig(v=>({...v, sg_domain:e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Template ID</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['sg_template']||''} onChange={(e)=>setDestinationConfig(v=>({...v, sg_template:e.target.value}))} />
                    </div>
                  </div>
                )}
                {selectedDestination === 'Twilio SMS' && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">From Number</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['tw_from']||''} onChange={(e)=>setDestinationConfig(v=>({...v, tw_from:e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Message Template</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['tw_template']||''} onChange={(e)=>setDestinationConfig(v=>({...v, tw_template:e.target.value}))} />
                    </div>
                  </div>
                )}
                {selectedDestination === 'SFTP Channel' && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Host</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['sftp_host']||''} onChange={(e)=>setDestinationConfig(v=>({...v, sftp_host:e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Username</label>
                      <input className="w-full border rounded-md px-3 py-2" value={destinationConfig['sftp_user']||''} onChange={(e)=>setDestinationConfig(v=>({...v, sftp_user:e.target.value}))} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activationStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Your Activation</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Run Schedule</label>
                <select className="w-full border rounded-md px-3 py-2" value={scheduleType} onChange={(e)=>setScheduleType(e.target.value as any)}>
                  <option>Daily</option>
                  <option>Every</option>
                  <option>Once</option>
                </select>
              </div>
              {scheduleType === 'Every' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Every</label>
                  <input type="number" min={1} className="w-full border rounded-md px-3 py-2" value={scheduleEveryN} onChange={(e)=>setScheduleEveryN(parseInt(e.target.value)||1)} />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Time</label>
                <div className="flex gap-2">
                  <input className="w-16 border rounded-md px-2 py-2" value={scheduleTime.hour} onChange={(e)=>setScheduleTime(v=>({...v, hour:e.target.value.padStart(2,'0')}))} />
                  <span className="self-center">:</span>
                  <input className="w-16 border rounded-md px-2 py-2" value={scheduleTime.minute} onChange={(e)=>setScheduleTime(v=>({...v, minute:e.target.value.padStart(2,'0')}))} />
                  <select className="border rounded-md px-2 py-2" value={scheduleTime.ampm} onChange={(e)=>setScheduleTime(v=>({...v, ampm:e.target.value}))}>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4" checked={excludePrevious} onChange={(e)=>setExcludePrevious(e.target.checked)} />
              Exclude Previous Recipients
            </label>
          </div>
        )}
        {activationStep === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Audience</div>
                <div className="font-medium text-gray-900">{audiences[selectedAudienceIdx].audience}</div>
                <div className="text-sm text-gray-600">Segment: {audiences[selectedAudienceIdx].segment}</div>
                <div className="text-sm text-gray-600">Count: {audiences[selectedAudienceIdx].count.toLocaleString()}</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Destination</div>
                <div className="font-medium text-gray-900">{selectedDestination || 'Not selected'}</div>
                <div className="text-sm text-gray-600">Schedule: {scheduledForText()}</div>
                <div className="text-sm text-gray-600">Exclude Previous: {excludePrevious ? 'Yes':'No'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SuccessModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        title="Activation Completed"
        message={`Your activation has been finalized.\nAudience: ${audiences[selectedAudienceIdx].segment} (${audiences[selectedAudienceIdx].count.toLocaleString()})\nChannel: ${(selectedDestination||'N/A').toUpperCase()} • Schedule: ${scheduledForText()}`}
        actionLabel="Done"
        onAction={() => setShowFinishModal(false)}
      />


      <div className="mt-6 flex items-center justify-end space-x-3">
        <Button variant="ghost" size="sm" onClick={() => setActivationStep((s) => Math.max(1, s - 1))}>Previous</Button>
        <Button size="sm" onClick={() => {
          if (activationStep < activationSteps.length) {
            setActivationStep((s) => s + 1);
          } else {
            const a = audiences[selectedAudienceIdx];
            const rec = {
              id: `act-${Date.now()}`,
              audience: `${a.audience} • ${a.segment}`,
              channel: selectedDestination || 'N/A',
              count: a.count,
              scheduledFor: scheduledForText(),
              createdAt: new Date().toISOString()
            };
            const stored = localStorage.getItem('initro_activation_history');
            const list = stored ? JSON.parse(stored) : [];
            list.unshift(rec);
            localStorage.setItem('initro_activation_history', JSON.stringify(list));
            setShowFinishModal(true);
          }
        }}>
          {activationStep === activationSteps.length ? 'Start Campaign' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
