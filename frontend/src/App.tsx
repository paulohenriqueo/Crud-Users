import { useEffect, useState } from 'react'
import './App.css'
import type { User, UserInput } from './types/user'
import { createUser, listUsers, updateUser } from './api/users'
import { UserList } from './components/UserList'
import { UserForm } from './components/UserForm'

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<User | null>(null);


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
      {!loading && !error && <UserList users={users} onEdit={setEditing} />}
    </main>
  );
}

export default App
