import NotFound from '@/components/common/NotFound'
import {Header} from '@/components/sections/header'
import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {ThemeProvider} from "@/components/theme-provider.tsx";
// import React from 'react'

// async function loadDevtools() {
//     const [routerDevtools, reactQueryDevtools] = await Promise.all([
//         import('@tanstack/router-devtools'),
//         import('@tanstack/react-query-devtools'),
//     ])
//     return {
//         default: () => (
//             <>
//                 <routerDevtools.TanStackRouterDevtools/>
//                 <reactQueryDevtools.ReactQueryDevtools/>
//             </>
//         ),
//     }
// }
//
// const TanStackDevtools
//     = import.meta.env.MODE === 'production' ? () => null : React.lazy(loadDevtools)

export const Route = createRootRoute({
    component: () => (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Outlet/>
            <TanStackRouterDevtools/>
        </ThemeProvider>
    ),
    notFoundComponent: () => (
        <>
            <Header/>
            <NotFound/>
        </>
    ),
})