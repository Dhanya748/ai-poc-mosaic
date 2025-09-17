/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Segment result from the /run API
 */
export interface SegmentResult {
  query: string;
  results: Record<string, any>[];
  error?: string | null;
}

/**
 * Unified response from the /run API
 */
export interface RunResponse {
  type: "segmented";
  segments: SegmentResult[];
}

/**
 * API client wrapper for /run
 */
export async function runQuery(query: string): Promise<RunResponse> {
  const res = await fetch("http://127.0.0.1:8000/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}


