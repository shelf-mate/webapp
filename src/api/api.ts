import axios from 'axios';
import {Unit} from "shelfmate-typings-package";

// Erstelle eine Axios-Instanz mit Standardwerten
const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Jetzt kannst du überall apiClient verwenden:
export async function getAllUnits(): Promise<Unit[]> {
    const response = await apiClient.get<{ data: Unit[] }>('/units');
    return response.data.data;
}
