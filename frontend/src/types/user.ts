export type User = {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    createdAt: string;
};

export type UserInput = {
    name: string;
    email: string;
    role: string;
}