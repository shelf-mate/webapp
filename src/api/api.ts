import axios from 'axios';
import {Unit} from "shelfmate-typings-package";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function getAllUnits(): Promise<Unit[]> {
    const response = await apiClient.get<{ data: Unit[] }>('/units');
    return response.data.data;
}
