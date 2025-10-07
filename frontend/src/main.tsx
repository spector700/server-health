import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Import the generated route tree
import {routeTree} from './routeTree.gen'

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </StrictMode>,
)