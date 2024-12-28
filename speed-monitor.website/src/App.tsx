import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Header from './components/Header'
import Main from './components/Main'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Main />
    </QueryClientProvider>
  )
}

export default App
