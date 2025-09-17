import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Segment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  count: number;
  naturalQuery?: string; // Add this to the interface
  generatedSql?: string;
}

const API_BASE = "http://127.0.0.1:8000/segments";

// Placeholder Stepper
const Stepper: FC<{ currentStep: number; steps: string[] }> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <p className={`ml-2 ${index + 1 <= currentStep ? "text-purple-600" : "text-gray-600"}`}>
            {step}
          </p>
          {index < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
        </div>
      ))}
    </div>
  );
};

// -------------------- Modal --------------------
const CreateSegmentModal: FC<{
  onClose: () => void;
  onSave: (newSegment: Segment) => void;
}> = ({ onClose, onSave }) => {
  const [query, setQuery] = useState("");
  const [segmentName, setSegmentName] = useState("");
  const [generatedSql, setGeneratedSql] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [apiSegment, setApiSegment] = useState<Segment | null>(null);

  const handleCreateSegment = async () => {
    if (!query) return;

    try {
      const response = await fetch(`${API_BASE}/create-and-run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          name: segmentName || undefined, // Send undefined instead of a default string
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate segment:", errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const data: Segment = await response.json();
      setGeneratedSql(data.generatedSql || "");
      setCount(data.count);
      setSegmentName(data.name);
      setApiSegment(data);
    } catch (err) {
      console.error("Error creating segment:", err);
      alert(`Error creating segment: ${err}`);
    }
  };

  const handleSave = async () => {
    // Button is disabled if apiSegment is null, so this check is for safety
    if (!apiSegment) {
      alert("Please generate a segment before saving.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- THIS IS THE CORRECTED PAYLOAD ---
        body: JSON.stringify({
          naturalQuery: apiSegment.naturalQuery, // Send original natural language query
          query: apiSegment.generatedSql,      // Send the generated SQL
          name: segmentName || apiSegment.name,
          description: apiSegment.description,
          count: apiSegment.count,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save segment:", errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      const savedSegment: Segment = await response.json();
      onSave(savedSegment);
      onClose();
    } catch (err) {
      console.error("Error saving segment:", err);
      alert(`Error saving segment: ${err}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Segment</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            ✖
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Left: Input */}
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="segmentName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Segment Name
              </label>
              <input
                type="text"
                id="segmentName"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="e.g., High-Intent Users"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-800 mb-2">Build your segment...</h3>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Customers with $500+ sales last year"
                className="w-full h-24 p-2 border border-gray-300 rounded-md flex-1"
              />
              <button
                onClick={handleCreateSegment}
                className="mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Create my segment
              </button>
            </div>
          </div>

          {/* Right: Insights */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-2">Insights</h3>
            {count !== null ? (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="text-center p-6 bg-white rounded-lg border">
                  <p className="text-sm text-gray-500">Total Count</p>
                  <p className="text-5xl font-bold text-purple-600 mt-2">
                    {/* --- IMPROVEMENT: Better Number Formatting --- */}
                    {count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border flex-1">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Generated SQL Query
                  </h4>
                  <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>{generatedSql}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                <p>Enter criteria and click "Create my segment" to see insights.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiSegment}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            Save Segment
          </button>
        </footer>
      </div>
    </div>
  );
};

// -------------------- Page --------------------
const AudiencePage: FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]); // Store IDs for efficiency

  const steps = ["Add Segments"];

  // Fetch saved segments
  useEffect(() => {
    fetch(`${API_BASE}`)
      .then((res) => res.json())
      .then((data: Segment[]) => setSegments(data))
      .catch((err) => console.error("Error fetching segments:", err));
  }, []);

  const handleToggleSegment = (segmentId: string) => {
    setSelectedSegmentIds((prev) =>
      prev.includes(segmentId)
        ? prev.filter((id) => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleSaveNewSegment = (newSegment: Segment) => {
    setSegments((prev) => [newSegment, ...prev]);
    // Automatically select the newly created segment
    if (!selectedSegmentIds.includes(newSegment.id)) {
      setSelectedSegmentIds((prev) => [...prev, newSegment.id]);
    }
  };
  
  const totalCount = segments
    .filter(s => selectedSegmentIds.includes(s.id))
    .reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {showModal && (
        <CreateSegmentModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveNewSegment}
        />
      )}

      {/* Flow */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
        <Stepper currentStep={1} steps={["Segment", "Activation"]} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            CDP {" > "} Audience Segmentation {" > "} Audience
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Customer Win back</h1>
        </div>
        <div className="bg-white p-3 rounded-lg border text-center">
          <p className="text-sm font-medium text-gray-500">Total Count</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {totalCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Segments Table */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Segments</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md"
          >
            + Create New Segment
          </button>
        </div>

        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 w-16">Select</th>
                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Segment</th>
                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {segments.map((segment) => (
                    <tr key={segment.id}>
                       <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={selectedSegmentIds.includes(segment.id)}
                          onChange={() => handleToggleSegment(segment.id)}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        <div className="font-medium text-gray-900">{segment.name}</div>
                        <div className="text-gray-500">{segment.description}</div>
                      </td>
                      {/* --- IMPROVEMENT: Better Date Formatting --- */}
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{new Date(segment.createdAt).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{segment.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/app/activations")}
          disabled={selectedSegmentIds.length === 0}
          className="px-6 py-2 bg-purple-600 text-white rounded-md disabled:bg-purple-300"
        >
          Go to Activation
        </button>
      </div>
    </div>
  );
};

export default AudiencePage;