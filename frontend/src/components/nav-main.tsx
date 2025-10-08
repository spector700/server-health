import {SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem,} from "@/components/ui/sidebar.tsx"
import {CreateServerButton} from "@/components/ui/create-server-button.tsx";


export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <CreateServerButton/>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
