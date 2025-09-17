import { useState } from "react";
import { runQuery, RunResponse, SegmentResult } from "@shared/api";

export default function Index() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGetSnapshot = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await runQuery(query);
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // ... render UI
}
