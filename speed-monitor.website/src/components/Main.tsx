import { useQuery } from "@tanstack/react-query"
import Graph from "./Graph";
import Dashboard from "./Dashboard";


export default function Main() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['speed-data'],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: import.meta.env.VITE_API_KEY,
        }),
      });
      const { data } = await response.json();
      const dataResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/speed`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return dataResponse.json();
    },
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <Dashboard points={data.data.points} />
      <Graph points={data.data.points} />
    </div>
  )
};
