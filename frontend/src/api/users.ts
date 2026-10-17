import type { User, UserInput } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type ApiError = {
    message: string | string[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const body: ApiError | null = await response.json().catch(() => null);
        const message = body?.message ?? `Erro ${response.status}`;
        throw new Error(Array.isArray(message) ? message.join('\n') : message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export function listUsers(): Promise<User[]> {
    return request<User[]>('/users');
};

export function createUser(data: UserInput): Promise<User> {
    return request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateUser(id: string, data: UserInput): Promise<User> {
    return request<User>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export function deleteUser(id: string): Promise<void> {
    return request<void>(`/users/${id}`, { method: 'DELETE' });
}
