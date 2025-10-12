export interface Server {
    id: string;
    name: string;
    hostname: string;
    ipAddress: string;
    port: string;
    location: string | null;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}

export interface HealthMetric {
    id: string;
    serverId: string;
    status: 'UP' | 'DOWN';
    responseTime: number;
    timestamp: string;
}