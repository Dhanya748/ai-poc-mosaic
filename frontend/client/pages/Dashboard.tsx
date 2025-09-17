import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Trash2, 
  Eye, 
  Plus, 
  TrendingUp, 
  Target, 
  Users, 
  Brain,
  Activity,
  Mail,
  MessageSquare,
  Bell,
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import SuccessModal from "@/components/ui/SuccessModal";
import { toast } from "sonner";

interface Source {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
  size: number;
  performance: number;
  trend: "up" | "down" | "stable";
}

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push";
  status: "running" | "pending" | "completed";
  performance: number;
  reach: number;
}

interface AIInsight {
  id: string;
  type: "opportunity" | "warning" | "success";
  title: string;
  description: string;
  action?: string;
  timestamp: string;
}

export default function Dashboard() {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const stored = localStorage.getItem("initro_sources");
  const [sources, setSources] = useState<Source[]>(stored ? JSON.parse(stored) : [
    { id: "snowflake-1", name: "Snowflake - Marketing" },
    { id: "s3-logs", name: "S3 - Events Bucket" },
  ]);

  const [topSegments] = useState<Segment[]>([
    { id: "seg-1", name: "High-Value VIPs", size: 850, performance: 23.4, trend: "up" },
    { id: "seg-2", name: "Cart Abandoners", size: 12500, performance: 18.7, trend: "up" },
    { id: "seg-3", name: "Lapsed Customers", size: 24000, performance: 8.2, trend: "down" },
  ]);

  const [activeCampaigns] = useState<Campaign[]>([
    { id: "camp-1", name: "VIP Upsell", type: "email", status: "running", performance: 24.3, reach: 850 },
    { id: "camp-2", name: "Cart Recovery", type: "sms", status: "running", performance: 18.9, reach: 3200 },
    { id: "camp-3", name: "Win-back", type: "push", status: "pending", performance: 0, reach: 24000 },
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: "ai-1",
      type: "opportunity",
      title: "Segment Opportunity Detected",
      description: "High-intent users showing 34% higher conversion potential",
      action: "Create targeted campaign",
      timestamp: "2 hours ago"
    },
    {
      id: "ai-2", 
      type: "success",
      title: "Campaign Performance Improved",
      description: "VIP Upsell campaign exceeding goals by 18%",
      timestamp: "4 hours ago"
    },
    {
      id: "ai-3",
      type: "warning",
      title: "Engagement Rate Declining",
      description: "Lapsed Customers segment showing reduced responsiveness",
      action: "Review messaging strategy",
      timestamp: "1 day ago"
    },
  ]);

  const handleDisconnect = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    if (selectedSourceId) {
      const updatedSources = sources.filter(s => s.id !== selectedSourceId);
      setSources(updatedSources);
      localStorage.setItem("initro_sources", JSON.stringify(updatedSources));
      toast.success("Source disconnected successfully");
    }
    setShowDisconnectModal(false);
    setSelectedSourceId(null);
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "sms": return <MessageSquare className="h-4 w-4" />;
      case "push": return <Bell className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity": return <Zap className="h-5 w-5 text-yellow-600" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Brain className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SuccessModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        title="Disconnect Source?"
        message="Are you sure you want to disconnect this data source? This action cannot be undone."
        actionLabel="Disconnect"
        onAction={confirmDisconnect}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your iNitro agentic decisioning system</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline">
            <Link to="/app/audience">Create Segment</Link>
          </Button>
          <Button asChild>
            <Link to="/app/setup">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">AI Decisions</p>
              <p className="text-3xl font-bold text-gray-900">1,847</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% improvement
              </p>
            </div>
            <Brain className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reach</p>
              <p className="text-3xl font-bold text-gray-900">248K</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Users className="h-3 w-3 mr-1" />
                Unified profiles
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                2 pending approval
              </p>
            </div>
            <Target className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Confidence</p>
              <p className="text-3xl font-bold text-gray-900">84%</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                AI recommendations
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insights & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Insights & Recommendations
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{insight.timestamp}</span>
                      {insight.action && (
                        <Button variant="ghost" size="sm" className="text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Segments */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Top Performing Segments
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app/audience">Manage Segments</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {topSegments.map((segment) => (
                <div key={segment.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{segment.name}</h3>
                    <p className="text-sm text-gray-500">{segment.size.toLocaleString()} members</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{segment.performance}%</p>
                      <p className="text-xs text-gray-500">conversion rate</p>
                    </div>
                    {getTrendIcon(segment.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Setup */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border p-6">
            <div className="flex items-center mb-3">
              <Plus className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="font-semibold text-gray-900">Quick Setup</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Connect your data and start making AI-driven decisions</p>
            <div className="space-y-2">
              <Button asChild className="w-full" size="sm">
                <Link to="/app/setup">
                  <Database className="h-4 w-4 mr-2" />
                  Add Data Source
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link to="/app/audience">
                  <Target className="h-4 w-4 mr-2" />
                  Create Segment
                </Link>
              </Button>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Active Campaigns</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app/activations">View All</Link>
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getChannelIcon(campaign.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-xs text-gray-500">{campaign.reach.toLocaleString()} reach</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={campaign.status === "running" ? "default" : "secondary"} className="text-xs">
                      {campaign.status}
                    </Badge>
                    {campaign.performance > 0 && (
                      <p className="text-xs text-green-600 mt-1">{campaign.performance}% CTR</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Sources */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Data Sources</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">{sources.length}</span>
              </div>
            </div>
            <div className="p-4">
              {sources.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No sources connected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sources.slice(0, 3).map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{source.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/app/sources">
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDisconnect(source.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
