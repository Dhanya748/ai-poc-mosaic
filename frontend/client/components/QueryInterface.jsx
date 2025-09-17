import React, { useState } from 'react';

// Hardcode the backend URL for the local development environment
const API_BASE_URL = 'http://localhost:8000';

function QueryInterface() {
  const [question, setQuestion] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setApiResponse(null);
    setError(null);

    fetch(`${API_BASE_URL}/sql/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setApiResponse(data);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>SQL Query Interface</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="question-input" style={{ display: 'block', marginBottom: '5px' }}>
            Ask a question about your data:
          </label>
          <input
            id="question-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How many customers are in New York?"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white' }}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {error && <div style={{ marginTop: '20px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px' }}><strong>Error:</strong> {error}</div>}

      {apiResponse && (
        <div style={{ marginTop: '20px' }}>
          <h2>Results</h2>
          <div>
            <h3>Generated SQL Query:</h3>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{apiResponse.query}</code>
            </pre>
          </div>
          <div>
            <h3>Database Output:</h3>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{JSON.stringify(apiResponse.results, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryInterface;

