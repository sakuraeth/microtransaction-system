import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function App() {
  const [fetchedData, setFetchedData] = useState([]);

  const retrieveDataFromApi = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      const jsonData = await response.json();
      setFetchedData(jsonData);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    retrieveDataFromApi();
  }, []);

  return (
    <div className="app">
      <h1>Frontend Interactions and User Events</h1>
      <button onClick={retrieveDataFromApi}>Fetch Data</button>
      <div className="data-container">
        {fetchedData && fetchedData.map((item, index) => (
          <div key={index}>{item.title}</div>
        ))}
      </div>
    </div>
  );
}

export default App;