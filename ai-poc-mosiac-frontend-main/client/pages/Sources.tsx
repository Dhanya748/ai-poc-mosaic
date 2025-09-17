import { useState, useEffect, FC } from "react";
import { Button } from "@/components/ui/button";
import { Database, Plus, Settings, Trash2, ServerCrash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// --- Source Interface ---
interface Source {
  id: number;
  name: string;
  type: string;
  created_at: string;
}

// --- Loading Spinner ---
const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center p-16">
    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
  </div>
);

// --- Source Icon ---
const SourceIcon: FC<{ type: string }> = ({ type }) => (
  <Database className="h-6 w-6 text-blue-600" />
);

export default function Sources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Create Modal State ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", type: "" });

  // --- Delete Modal State ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  // --- Fetch Sources ---
  const fetchSources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/sources");
      if (!response.ok) throw new Error("Failed to fetch sources");
      const data: Source[] = await response.json();
      setSources(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // --- Create Source ---
  const handleCreateSource = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSource),
      });
      if (!response.ok) throw new Error("Failed to create source");
      toast.success("Source created successfully!");
      setShowCreateModal(false);
      setNewSource({ name: "", type: "" });
      fetchSources();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- Delete Source ---
  const handleDeleteSource = async () => {
    if (!selectedSource) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/sources/${selectedSource.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete source");
      toast.success(`Source "${selectedSource.name}" deleted`);
      setShowDeleteModal(false);
      setSelectedSource(null);
      fetchSources();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- UI ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Data Sources</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center bg-red-50 rounded-lg">
        <ServerCrash className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-800">Failed to Load Sources</h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* --- Create Source Modal --- */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                placeholder="Source name"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                placeholder="e.g. postgres, mysql"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSource}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Source Modal --- */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Source</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to disconnect {selectedSource?.name}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSource}>
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Page Header --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Data Sources</h1>
          <p className="text-sm text-gray-600">Manage connections to your data systems</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* --- Sources List --- */}
      {sources.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sources connected</h3>
          <p className="text-gray-500 mb-4">Get started by connecting your first data source.</p>
          <Button onClick={() => setShowCreateModal(true)}>Add Your First Source</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Connected Sources ({sources.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sources.map((source) => (
              <div key={source.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <SourceIcon type={source.type} />
                  </div>
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-gray-500">
                      {source.type} • Connected on {new Date(source.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" disabled>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSource(source);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
