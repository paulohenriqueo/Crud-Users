import { useState, type SubmitEvent } from "react";
import type { User, UserInput } from "../types/user";

type Props = {
    user: User | null;
    onSubmit: (data: UserInput) => Promise<void>;
    onCancel: () => void;
};

export function UserForm({ user, onSubmit, onCancel}: Props){
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [role, setRole] = useState(user?.role ?? '');
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await onSubmit({ name, email, role });
            if (!user) {
                setName('');
                setEmail('');
                setRole('');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setSaving(false);
        }
    }

    return (
         <form className="user-form" onSubmit={handleSubmit} noValidate>
      <h2>{user ? 'Editar usuário' : 'Novo usuário'}</h2>

      <label>
        Nome
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Cargo (opcional)
        <input value={role} onChange={(e) => setRole(e.target.value)} />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {user && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );

}