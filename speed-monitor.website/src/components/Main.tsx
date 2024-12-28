import { useQuery } from "@tanstack/react-query"
console.log(import.meta.env) // "123"


export default function Main() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['token'],
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
      return await response.json()
    },
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <div>{isFetching ? 'Updating...' : ''}</div>
      <div>
        {data.data.token}
      </div>
    </div>
  )
};
