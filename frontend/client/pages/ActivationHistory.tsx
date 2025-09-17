import { useEffect, useState } from 'react';
import type { FC } from 'react';

// Interfaces
interface ActivationRecord {
  id: string;
  audience: string;
  channel: string;
  count: number;
  scheduledFor: string;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  segment: string;
  estimatedReach: number;
  goal: string;
  status: 'pending' | 'running' | 'completed' | 'rejected';
  scheduledFor?: string;
}

interface AIDecision {
  id: string;
  action: string;
  customerId: string;
  channel: string;
  confidence: number;
  outcome?: 'converted' | 'ignored';
  timestamp: string;
}

// Mock data
const mockCampaigns: Campaign[] = [
  { id: 'cam1', name: 'Summer Sale Early Access', type: 'email', segment: 'VIP Customers', estimatedReach: 12500, goal: 'Drive early sales', status: 'pending', scheduledFor: 'Tomorrow, 10:00 AM' },
  { id: 'cam2', name: 'Flash Deal Notification', type: 'push', segment: 'Active Mobile Users', estimatedReach: 48000, goal: 'Increase app engagement', status: 'pending' },
  { id: 'cam3', name: 'Q3 Newsletter', type: 'email', segment: 'All Subscribers', estimatedReach: 150000, goal: 'Content distribution', status: 'running' },
  { id: 'cam4', name: 'Abandoned Cart Reminder', type: 'sms', segment: 'Recent Cart Activity', estimatedReach: 2300, goal: 'Recover lost sales', status: 'completed' },
];

const mockRecentDecisions: AIDecision[] = [
  { id: 'dec1', action: 'Send Promo Email', customerId: 'cust_...a4f2', channel: 'Email', confidence: 0.92, outcome: 'converted', timestamp: '2m ago' },
  { id: 'dec2', action: 'Target with Ad', customerId: 'cust_...b81e', channel: 'Social', confidence: 0.81, timestamp: '5m ago' },
  { id: 'dec3', action: 'Send Push Notification', customerId: 'cust_...c3d9', channel: 'Push', confidence: 0.76, outcome: 'ignored', timestamp: '12m ago' },
  { id: 'dec4', action: 'Hold Communication', customerId: 'cust_...e0a7', channel: 'N/A', confidence: 0.95, timestamp: '15m ago' },
  { id: 'dec5', action: 'Send Promo Email', customerId: 'cust_...f5b3', channel: 'Email', confidence: 0.88, outcome: 'converted', timestamp: '21m ago' },
];

// SVG icon helper
const Icon = ({ path, className = 'h-6 w-6' }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

const Rocket = ({ className }: { className?: string }) => (
  <Icon className={className} path="M14.25 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM16.5 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM19.03 8.22a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06-1.06l-1.06-1.06zM21 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM17.53 15.78a.75.75 0 00-1.06-1.06l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06zM15 18a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zM11.992 12.235a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06-1.06l-1.5-1.5zM3.97 8.22a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 101.06-1.06L3.97 8.22zM3 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM4.97 15.78a.75.75 0 00-1.06-1.06L2.85 15.78a.75.75 0 101.06 1.06l1.06-1.06zM7.5 18a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H7.5z" />
);
const TrendingUp = ({ className }: { className?: string }) => (
  <Icon className={className} path="M2.25 18L9 11.25l4.5 4.5L21.75 6H15.75a.75.75 0 010-1.5h8.25a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V8.62L13.5 18.37l-4.5-4.5L2.25 18z" />
);
const Users = ({ className }: { className?: string }) => (
  <Icon className={className} path="M15 6a3 3 0 11-6 0 3 3 0 016 0zM17.25 8.25a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM21.75 18.75a.75.75 0 00-1.5 0v-1.5a3 3 0 00-3-3H6a3 3 0 00-3 3v1.5a.75.75 0 001.5 0v-1.5a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5v1.5z" />
);
const Clock = ({ className }: { className?: string }) => (
  <Icon className={className} path="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" />
);
const Target = ({ className }: { className?: string }) => (
  <Icon className={className} path="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 15a3 3 0 100-6 3 3 0 000 6zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM12 21.75a.75.75 0 01-.75-.75v-2.25a.75.75 0 011.5 0V21a.75.75 0 01-.75.75zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" />
);
const Play = ({ className }: { className?: string }) => (
  <Icon className={className} path="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
);
const Pause = ({ className }: { className?: string }) => (
  <Icon className={className} path="M15.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zM8.25 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" />
);
const MoreHorizontal = ({ className }: { className?: string }) => (
  <Icon className={className} path="M6 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
);
const CheckCircle = ({ className }: { className?: string }) => (
  <Icon className={className} path="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);
const XCircle = ({ className }: { className?: string }) => (
  <Icon className={className} path="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);
const Eye = ({ className }: { className?: string }) => (
  <Icon className={className} path="M2.036 12.322a1.012 1.012 0 010-.644l7.757-4.23a1.125 1.125 0 011.125 0l7.757 4.23a1.012 1.012 0 010 .644l-7.757 4.23a1.125 1.125 0 01-1.125 0l-7.757-4.23z" />
);
const Email = ({ className }: { className?: string }) => (
  <Icon className={className} path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
);
const SMS = ({ className }: { className?: string }) => (
  <Icon className={className} path="M10.5 6h9a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5zM3.75 3.75a1.5 1.5 0 00-1.5 1.5v9a1.5 1.5 0 001.5 1.5h.75v-9A2.25 2.25 0 016.75 3h9V3.75h-9a.75.75 0 00-.75.75z" />
);
const Push = ({ className }: { className?: string }) => (
  <Icon className={className} path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
);

const ActivationHistory: FC = () => {
  const [records, setRecords] = useState<ActivationRecord[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [recentDecisions] = useState<AIDecision[]>(mockRecentDecisions);

  const loadHistory = () => {
    const stored = localStorage.getItem('initro_activation_history');
    const history = stored ? JSON.parse(stored) : [];
    if (history.length === 0) {
      const mockHistory: ActivationRecord[] = [
        { id: 'hist1', audience: 'Recent Signups', channel: 'email', count: 520, scheduledFor: 'Instant', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 'hist2', audience: 'Loyal Customers', channel: 'sms', count: 1850, scheduledFor: 'Instant', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      ];
      localStorage.setItem('initro_activation_history', JSON.stringify(mockHistory));
      setRecords(mockHistory);
    } else {
      setRecords(history);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('initro_activation_history');
    loadHistory();
  };

  const handleApprove = (id: string) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'running' } : c)));
  };
  const handleReject = (id: string) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c)));
  };

  const getChannelIcon = (type: Campaign['type']) => {
    const iconClass = 'h-5 w-5 text-gray-700';
    if (type === 'email') return <Email className={iconClass} />;
    if (type === 'sms') return <SMS className={iconClass} />;
    if (type === 'push') return <Push className={iconClass} />;
    return null;
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800 animate-pulse',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    } as const;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaign Activations History</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor AI-driven campaign decisions and manage approvals.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-90" style={{ background: 'hsl(var(--sidebar-primary))' }}>
          <Rocket className="h-4 w-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<TrendingUp className="h-8 w-8 text-green-600" />} title="Decisions Made" value="1,847" trend="+18% this week" trendColor="text-green-600" />
        <StatCard icon={<Users className="h-8 w-8 text-blue-600" />} title="Total Reach" value="37.4K" trend="Active campaigns" trendColor="text-blue-600" />
        <StatCard icon={<Clock className="h-8 w-8 text-yellow-600" />} title="Pending Approval" value={campaigns.filter((c) => c.status === 'pending').length.toString()} trend="Requires review" trendColor="text-yellow-600" />
        <StatCard icon={<Target className="h-8 w-8 text-purple-600" />} title="Avg. Confidence" value="84%" trend="AI recommendations" trendColor="text-purple-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Approval Queue */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="p-4 border-b font-semibold flex items-center"><Clock className="h-5 w-5 mr-2 text-muted-foreground" />Approval Queue</h2>
            <div className="divide-y">
              {campaigns.filter((c) => c.status === 'pending').map((campaign) => (
                <CampaignItem key={campaign.id} campaign={campaign} onApprove={handleApprove} onReject={handleReject} getChannelIcon={getChannelIcon} />
              ))}
              {campaigns.filter((c) => c.status === 'pending').length === 0 && (
                <p className="p-4 text-sm text-muted-foreground text-center">No campaigns awaiting approval.</p>
              )}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="p-4 border-b font-semibold flex items-center"><Play className="h-5 w-5 mr-2 text-muted-foreground" />Active & Recent Campaigns</h2>
            <div className="divide-y">
              {campaigns.filter((c) => c.status !== 'pending').map((campaign) => (
                <ActiveCampaignItem key={campaign.id} campaign={campaign} getChannelIcon={getChannelIcon} getStatusBadge={getStatusBadge} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent AI Decisions */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <h2 className="p-4 border-b font-semibold flex items-center"><Target className="h-5 w-5 mr-2 text-muted-foreground" />Recent AI Decisions</h2>
          <div className="p-4 space-y-3 max-h-[450px] overflow-y-auto">
            {recentDecisions.map((decision) => (
              <DecisionLog key={decision.id} decision={decision} />
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Campaign Activations History Log</h2>
          <div className="space-x-2">
            <button onClick={loadHistory} className="px-3 py-2 text-sm rounded-md border bg-background shadow-sm hover:bg-muted">Refresh</button>
            <button onClick={handleClearHistory} className="px-3 py-2 text-sm rounded-md border text-red-600 bg-background shadow-sm hover:bg-muted">Clear</button>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">When</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Audience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Count</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">No activation history found</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.audience}</td>
                    <td className="px-4 py-3 text-sm"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-muted text-foreground/80">{r.channel}</span></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.scheduledFor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ icon, title, value, trend, trendColor }: { icon: JSX.Element; title: string; value: string; trend: string; trendColor: string }) => (
  <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
    <div className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
      </div>
    </div>
  </div>
);

const CampaignItem = ({ campaign, onApprove, onReject, getChannelIcon }: { campaign: Campaign; onApprove: (id: string) => void; onReject: (id: string) => void; getChannelIcon: (type: Campaign['type']) => JSX.Element | null }) => (
  <div className="p-4 hover:bg-muted/30 transition-colors duration-150">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">{getChannelIcon(campaign.type)}</div>
        <div>
          <h3 className="font-medium">{campaign.name}</h3>
          <p className="text-sm text-muted-foreground">
            {campaign.segment} • {campaign.estimatedReach.toLocaleString()} recipients
          </p>
          <p className="text-xs text-muted-foreground/80">Goal: {campaign.goal}</p>
          {campaign.scheduledFor && <p className="text-xs text-primary mt-1 font-semibold">Scheduled: {campaign.scheduledFor}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
        <button onClick={() => onReject(campaign.id)} className="p-2 text-red-600 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500">
          <XCircle className="h-5 w-5" />
        </button>
        <button onClick={() => onApprove(campaign.id)} className="p-2 text-green-600 rounded-full hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500">
          <CheckCircle className="h-5 w-5" />
        </button>
        <button className="p-2 text-muted-foreground rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted-foreground">
          <Eye className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

const ActiveCampaignItem = ({ campaign, getChannelIcon, getStatusBadge }: { campaign: Campaign; getChannelIcon: (type: Campaign['type']) => JSX.Element | null; getStatusBadge: (status: Campaign['status']) => JSX.Element }) => (
  <div className="p-4 hover:bg-muted/30 transition-colors duration-150">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">{getChannelIcon(campaign.type)}</div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{campaign.name}</h3>
            {getStatusBadge(campaign.status)}
          </div>
          <p className="text-sm text-muted-foreground">
            {campaign.segment} • {campaign.estimatedReach.toLocaleString()} recipients
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
        <button className="p-2 text-muted-foreground rounded-full hover:bg-muted">
          {campaign.status === 'running' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button className="p-2 text-muted-foreground rounded-full hover:bg-muted">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

const DecisionLog = ({ decision }: { decision: AIDecision }) => {
  const outcomeColor = decision.outcome === 'converted' ? 'text-green-600' : 'text-muted-foreground';
  return (
    <div className="text-xs border-l-2 border-primary/30 pl-3 py-1 hover:bg-primary/5">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{decision.action}</span>
        <span className="text-muted-foreground">{decision.timestamp}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{decision.customerId.substring(0, 12)}... • {decision.channel}</span>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-green-700">{Math.round(decision.confidence * 100)}%</span>
          {decision.outcome && <span className={outcomeColor}>• {decision.outcome}</span>}
        </div>
      </div>
    </div>
  );
};

export default ActivationHistory;
