import {useEffect, useState} from 'react';
import type {Server} from '@/types/api';
import {serverApi} from '@/services/api';
import {Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {IconTrendingUp} from "@tabler/icons-react";

export function ServerList() {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        serverApi.getAllServers()
            .then((data) => {
                setServers(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div
            className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-">

            {servers.map((server) => (
                <Card className="@container/card" key={server.id}>
                    <CardHeader>
                        <CardDescription><strong>{server.name}</strong> - {server.hostname}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            <strong>{server.name}</strong> - {server.hostname}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp/>
                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <IconTrendingUp className="size-4"/>
                        </div>
                        <div className="text-muted-foreground">
                            {server.location && ` (${server.location})`}
                        </div>
                    </CardFooter>
                </Card>

            ))}
        </div>
    );
}
