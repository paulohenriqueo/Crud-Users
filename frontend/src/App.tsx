import { useEffect, useState } from 'react'
import './App.css'
import type { User } from './types/user'
import { listUsers } from './api/users'
import { UserList } from './components/UserList'

function App() {
  const [users, setusers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listUsers()
    .then(setusers)
    .catch(() => {
      setError('Não foi possível carregar s usuários. A API está rodando?');
    })

    .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Lista de usuários</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <UserList users={users} />}
    </main>
  );
}

export default App
