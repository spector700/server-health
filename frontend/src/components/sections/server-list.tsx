import {serverApi} from '@/services/api';
import {Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TrashIcon} from "lucide-react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ServerStatusBadge} from "@/components/ui/server-status-badge.tsx";
import {ChartAreaInteractive} from "@/components/chart-area-interactive.tsx";

export function ServerList() {
    const queryClient = useQueryClient();

    // Fetch all servers
    const {data: servers = [], isLoading, isError, error} = useQuery({
        queryKey: ['servers'],
        queryFn: serverApi.getAllServers,
    });


    // Delete server mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => serverApi.deleteServer(id),
        onSuccess: async () => {
            // Refetch servers after deletion
            await queryClient.invalidateQueries({queryKey: ['servers']});
        },
        onError: (error) => {
            console.error('Error deleting server:', error);
        }
    });

    if (isLoading) return <div className="p-4">Loading servers...</div>;
    if (isError) return <div className="p-4 text-red-500">Error loading servers: {error?.message}</div>;
    if (servers.length === 0) return <div className="p-4">No servers yet. Create one!</div>;

    return (
        <div
            className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-">

            {servers.map((server) => (
                <Card className="@container/card" key={server.id}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            <strong>{server.name}</strong> - {server.hostname}
                        </CardTitle>
                        <CardContent className="mt-4 ">
                            <ChartAreaInteractive serverId={server.id}/>
                        </CardContent>
                        <CardAction>
                            <ServerStatusBadge serverId={server.id}/>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMutation.mutate(server.id)}
                            ><TrashIcon/></Button>
                        </CardAction>
                    </CardHeader>

                    {server.location &&
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="text-muted-foreground">
                                {`${server.location}`}
                            </div>
                        </CardFooter>
                    }
                </Card>
            ))}
        </div>
    );
}
