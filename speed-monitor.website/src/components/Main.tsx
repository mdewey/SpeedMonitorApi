import { useQuery } from "@tanstack/react-query"

import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory";

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
  console.log({ data })

  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <div style={{ backgroundColor: 'white', padding: '20px' }}>
        <VictoryChart
          theme={VictoryTheme.clean}
        >
          <VictoryLine
            interpolation="linear"
            data={data.data.points.map((point: { timestamp: any; downloadSpeed: any; }) => {
              return {
                x: point.timestamp,
                y: point.downloadSpeed,
              }
            })} />
        </VictoryChart>
      </div>
    </div>
  )
};
