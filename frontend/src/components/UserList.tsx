import type { User } from "../types/user";

type Props = {
  users: User[];
};

export function UserList({ users }: Props) {
    if (users.length === 0) {
        return <p>Nenhum usuário cadastrado</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Cargo</th>
                    <th>Criado em</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role || '--'}</td>
                        <td>{new Date(user.createdAt).toLocaleString('pt-BR')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}