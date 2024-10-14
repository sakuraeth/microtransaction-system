import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [fetchedData, setFetchedData] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const response = await fetchApi(`${API_BASE_URL}/data`);
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchApi = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  const handleApiResponse = (jsonData) => {
    setFetchedData(jsonData);
    setFetchError(null);
  };

  const handleApiError = (error) => {
    console.error('Error retrieving data:', error);
    setFetchError('Failed to fetch data. Please try again later.');
  };

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