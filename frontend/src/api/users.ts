import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function listUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao listar usuários`);
    }
    return response.json();
}