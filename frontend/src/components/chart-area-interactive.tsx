"use client"

import * as React from "react"
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {useIsMobile} from "@/hooks/use-mobile"
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {ToggleGroup, ToggleGroupItem,} from "@/components/ui/toggle-group"
import {useQuery} from "@tanstack/react-query";
import {healthMetricApi} from "@/services/api.tsx";

interface ServerHistoryChartProps {
    serverId: string;
}

const chartConfig = {
    uptime: {
        label: "Uptime",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive({serverId}: ServerHistoryChartProps) {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("24h")

    const hoursMap = {
        "24h": 24,
        "7d": 24 * 7,
        "30d": 24 * 30,
    }
    const hours = hoursMap[timeRange as keyof typeof hoursMap]

    const {data: history, isLoading} = useQuery({
        queryKey: ['server-history', serverId, hours],
        queryFn: () => healthMetricApi.getServerHistory(serverId),
        refetchInterval: (60 * 60) * 1000, // Refresh every 1 hour
    });

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("24h")
        }
    }, [isMobile])

    // Transform health metrics data for the chart
    const chartData = React.useMemo(() => {
        // Safety checks
        if (!history) {
            console.log("history is undefined or null");
            return [];
        }

        if (!Array.isArray(history)) {
            console.log("history is not an array:", history);
            return [];
        }

        if (history.length === 0) {
            console.log("history is empty array");
            return [];
        }

        return history.map((metric) => ({
            date: metric.timestamp,
            uptime: metric.status === "UP" ? 1 : 0, // 1 for up, 0 for down
            responseTime: metric.responseTime || 0,
            status: metric.status,
        }));
    }, [history]);

    if (isLoading) {
        return (
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Uptime History</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (chartData.length === 0) {
        return (
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Uptime History</CardTitle>
                    <CardDescription>No data available yet. Health checks will appear here.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="24h">Last 24 hours</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                        <ToggleGroupItem value="30">Last 30 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 24 hours"/>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="24h" className="rounded-lg">
                                Last 24 hours
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">

                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillUptime" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-uptime)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-uptime)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    hour: "2-digit",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis
                            domain={[0, 1]}
                            ticks={[0, 1]}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value === 1 ? "Online" : "Offline"}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            // month: "short",
                                            // day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                    }}
                                    indicator="dot"
                                    formatter={(_value, _name, item) => {
                                        return (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${item.payload.status === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}/>
                                                    <span>{item.payload.status === 'UP' ? 'Online' : 'Offline'}</span>
                                                </div>
                                                {item.payload.responseTime > 0 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Response: {item.payload.responseTime}ms
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }}
                                />
                            }
                        />
                        <Area
                            dataKey="uptime"
                            type="stepAfter"
                            fill="url(#fillUptime)"
                            stroke="var(--color-uptime)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
