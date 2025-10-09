import type {HealthMetric, Server} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const serverApi = {
    // GET all servers
    getAllServers: async (): Promise<Server[]> => {
        const response = await fetch(`${API_BASE_URL}/servers`);
        if (!response.ok) throw new Error('Failed to fetch servers');
        return response.json();
    },

    // GET server by ID
    getServerById: async (id: string): Promise<Server> => {
        const response = await fetch(`${API_BASE_URL}/servers/${id}`);
        if (!response.ok) throw new Error('Server not found');
        return response.json();
    },

    // POST create server
    createServer: async (serverData: {
        name: string;
        hostname: string;
        ipAddress: string;
        location: string
    }): Promise<Server> => {
        const response = await fetch(`${API_BASE_URL}/servers`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(serverData)
        });
        if (!response.ok) throw new Error('Failed to create server');
        return response.json();
    },

    // DELETE server
    deleteServer: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/servers/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete server');
    }
};

export const healthMetricApi = {
    getServerHistory: async (serverId: string, hours: number = 24): Promise<HealthMetric[]> => {
        const response = await fetch(`${API_BASE_URL}/v1/health-metrics/server/${serverId}?hours=${hours}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    },

    getLatestStatus: async (serverId: string): Promise<HealthMetric | null> => {
        const response = await fetch(`${API_BASE_URL}/v1/health-metrics/server/${serverId}/latest`);
        if (!response.ok) {
            if (response.status === 404) return null; // No checks yet
            throw new Error('Failed to fetch status');
        }
        return response.json();
    },
}