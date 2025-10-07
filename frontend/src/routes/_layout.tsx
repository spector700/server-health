import NotFound from '@/components/common/NotFound'
import {Header} from "@/components/sections/header";
import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
    component: layoutComponent,
    notFoundComponent: () => (
        <>
            <Header/>
            <NotFound/>
        </>
    ),
})

function layoutComponent() {
    return (
        <div className="relative h-full w-full">
            {/* Background grid */}
            <div
                className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
            </div>
            <Outlet/>
        </div>
    )
}