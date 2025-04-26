import { useState } from 'react';
import axios from 'axios';

function FetchOnClick() {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://9b08-2409-40d4-123-34ed-9dc-faee-1542-bd79.ngrok-free.app/api/professionalism-score', {
        "text" : "heya how you hanging man"
      });
      console.log('API Response:', response.data); // Log API response
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
};

export default FetchOnClick;
