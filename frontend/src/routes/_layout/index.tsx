import {createFileRoute} from '@tanstack/react-router'
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import React from "react";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {ServerList} from "@/components/sections/server-list.tsx";
import {ChartAreaInteractive} from "@/components/chart-area-interactive.tsx";

export const Route = createFileRoute('/_layout/')({
    component: Index,
})

function Index() {
    return (
        <SidebarProvider style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--sidebar-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
        >

            <AppSidebar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <ServerList/>
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive/>
                            </div>
                            {/*<DataTable data={data} />*/}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}