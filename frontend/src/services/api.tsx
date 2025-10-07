import type {CreateServerRequest, Server} from '@/types/api';

const API_BASE_URL = 'http://localhost:8080/api';

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
    createServer: async (serverData: CreateServerRequest): Promise<Server> => {
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