import { useEffect, useState } from 'react'
import './App.css'
import type { User, UserInput } from './types/user'
import { createUser, deleteUser, listUsers, updateUser } from './api/users'
import { UserList } from './components/UserList'
import { UserForm } from './components/UserForm'
import { ConfirmDialog } from './components/ConfirmDialog'

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    listUsers()
    .then(setUsers)
    .catch(() => {
      setError('Não foi possível carregar s usuários. A API está rodando?');
    })

    .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: UserInput){
    const created = await createUser(data);
    setUsers((current) => [...current, created]);
  }

  async function handleUpdate(data: UserInput){

    if (!editing) return;

    const updated = await updateUser(editing.id, data);
    setUsers((current) => 
      current.map((user) => (user.id === updated.id ? updated : user)),
    );
    setEditing(null);
  }

  async function handleDelete(user: User){
    setDeleting(null);
    setDeleting(user);
  }

  async function handleConfirmDelete(){
    if (!deleting) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleting.id);
      setUsers((current) => current.filter((u) => u.id !== deleting.id));
      if (editing?.id === deleting.id) setEditing(null);
      setDeleting(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro insesperado');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main>
      <h1>Lista de usuários</h1>

      <UserForm
        key={editing?.id ?? 'novo'}
        user={editing}
        onSubmit={editing ? handleUpdate : handleCreate}
        onCancel={() => setEditing(null)}
      />

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <UserList users={users} onEdit={setEditing} onDelete={handleDelete} />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir usuário"
        message={`Tem certeza que deseja excluir ${deleting?.name ?? ''}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        busy={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </main>
  );
}

export default App
