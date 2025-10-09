import {useQuery} from "@tanstack/react-query";
import {healthMetricApi} from "@/services/api";
import {Badge} from "@/components/ui/badge";
import {CircleIcon} from "lucide-react";

interface ServerStatusBadgeProps {
    serverId: string;
}

export function ServerStatusBadge({serverId}: ServerStatusBadgeProps) {
    const {data: status, isLoading} = useQuery({
        queryKey: ['server-status', serverId],
        queryFn: () => healthMetricApi.getLatestStatus(serverId),
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    if (isLoading) {
        return (
            <Badge variant="secondary" className="gap-1.5">
                <CircleIcon className="h-2 w-2 fill-gray-400 text-gray-400"/>
                Checking...
            </Badge>
        );
    }

    if (!status) {
        return (
            <Badge variant="secondary" className="gap-1.5">
                <CircleIcon className="h-2 w-2 fill-gray-400 text-gray-400"/>
                No data
            </Badge>
        );
    }

    const isUp = status.status === 'UP';

    return (
        <Badge
            variant={isUp ? "default" : "destructive"}
            className="gap-1.5"
        >
            <CircleIcon
                className={`h-2 w-2 ${isUp ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'}`}
            />
            {isUp ? 'Online' : 'Offline'}
            {/*    {status.responseTimeMs && isUp && (*/}
            {/*        <span className="text-xs opacity-75">*/}
            {/*    ({status.responseTimeMs}ms)*/}
            {/*</span>*/}
            {/*    )}*/}
        </Badge>
    );
}