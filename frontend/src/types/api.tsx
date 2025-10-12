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

export interface CreateServerRequest {
    name: string;
    hostname: string;
    ipAddress?: string;
    port: string;
    location?: string;
}

export interface UpdateServerRequest {
    name: string;
    hostname: string;
    ipAddress?: string;
    port: string;
    location?: string;
}

export interface HealthMetric {
    id: string;
    serverId: string;
    status: 'UP' | 'DOWN';
    responseTime: number;
    timestamp: string;
}