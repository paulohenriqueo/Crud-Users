import type { User } from "../types/user";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UserList({ users, onEdit, onDelete }: Props) {
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
                    <th className="edit">Opções</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role || '--'}</td>
                        <td>{new Date(user.createdAt).toLocaleString('pt-BR')}</td>
                        <td className="edit">
                            <button type="button" onClick={() => onEdit(user)}>
                                Editar
                            </button>
                            <button type="button" onClick={() => onDelete(user)}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}