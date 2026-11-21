import { useEffect, useState } from "react";
import { getAllPassengers } from "../../services/passengerService";

function ApiTest() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const data = await getAllPassengers();
        setPassengers(data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Unable to load passengers.");
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  if (loading) {
    return <p>Loading passengers...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-bold">
        Passenger API Test
      </h1>

      <p>Total passengers: {passengers.length}</p>

      <pre className="mt-4 overflow-auto rounded bg-slate-100 p-4 text-sm">
        {JSON.stringify(passengers, null, 2)}
      </pre>
    </div>
  );
}

export default ApiTest;