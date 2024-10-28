import React, { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [fetchedData, setFetchedData] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const fetchApi = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }, []);

  const fetchApiData = useCallback(async () => {
    try {
      const response = await fetchApi(`${API_BASE_URL}/data`);
      setFetchedData(response);
      setFetchError(null);
    } catch (error) {
      console.error('Error retrieving data:', error);
      setFetchError('Failed to fetch data. Please try again later.');
    }
  }, [fetchApi]);

  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  return (
    <div className="app">
      <h1>Frontend Interactions and User Events</h1>
      <button onClick={fetchApiData}>Fetch Data</button>
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="data-container">
        {fetchedData && fetchedData.map((item, index) => (
          <div key={index}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}

export default App;