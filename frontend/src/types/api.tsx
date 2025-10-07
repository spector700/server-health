export interface Server {
    id: string;
    name: string;
    hostname: string;
    ipAddress: string | null;
    port: number;
    location: string | null;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}

export interface CreateServerRequest {
    name: string;
    hostname: string;
    ipAddress?: string;
    port: number;
    location?: string;
}

export interface HealthMetric {
    id: string;
    serverId: string;
    cpuUsage: number;
    memoryUsage: number;
    memoryTotalMb: number;
    memoryUsedMb: number;
    diskUsage: number;
    diskTotalGb: number;
    diskUsedGb: number;
    status: 'healthy' | 'warning' | 'critical';
    timestamp: string;
}