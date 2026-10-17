# CRUD de Usuários

Aplicação para listar, criar, editar e excluir usuários, feita para o [teste técnico fullstack](https://github.com/2f-tecnologia/test-fullstack-typescript-javascript).

- **Backend:** NestJS + TypeScript, com validação feita pelo `class-validator`
- **Frontend:** React + Vite + TypeScript
- **Banco de dados:** em memória, como o enunciado permite. Os dados são perdidos quando a API reinicia.

## Dependências e versão do Node

Para rodar, basta ter o **Node.js 24.9 ou mais recente** (desenvolvido e testado com a versão 24.15.0) e o **npm 11**, que já vem com ele. O resto é instalado pelo `npm install` de cada pasta:

- **backend:** NestJS 12, class-validator, class-transformer, @nestjs/mapped-types, TypeScript 6 e Jest 30
- **frontend:** React 19, Vite 8 e TypeScript 6

Quem usa [nvm](https://github.com/nvm-sh/nvm) pode rodar `nvm install` na raiz do projeto: ele lê a versão do `.nvmrc`, instala o Node 24 se precisar e passa a usá-lo.

## Como rodar

Clone o repositório:

```bash
git clone https://github.com/paulohenriqueo/Crud-Users.git
cd Crud-Users
```

Depois use dois terminais, os dois a partir da raiz do repositório, e suba o backend antes do frontend.

### Backend

```bash
cd backend
npm install
npm run start:dev
```

A API sobe em http://localhost:3000. Para conferir, abra http://localhost:3000/users: sem cadastros, a resposta é `[]`. Se o terminal mostrar `EADDRINUSE`, a porta já está em uso; veja [Se a porta 3000 estiver ocupada](#se-a-porta-3000-estiver-ocupada).

O `npm install` do backend pode avisar sobre vulnerabilidades. Elas estão em dependências de desenvolvimento, e o `npm audit --omit=dev` não aponta nenhuma.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra no navegador o endereço que o Vite mostrar em `Local:` (por padrão, http://localhost:5173). Com a API no ar, a página mostra o formulário "Novo usuário" e, enquanto não houver cadastros, a mensagem "Nenhum usuário cadastrado". A lista é buscada quando a página abre: se aparecer "A API está rodando?", recarregue a página depois que a API subir.

### Se a porta 3000 estiver ocupada

A porta da API vem da variável `PORT`, e o endereço que o frontend usa vem da `VITE_API_URL`. Para usar a porta 3001, por exemplo:

```bash
# em backend/
PORT=3001 npm run start:dev

# em frontend/
echo "VITE_API_URL=http://localhost:3001" > .env.local
npm run dev
```

Esses comandos são para bash ou zsh (Linux, macOS, Git Bash ou WSL). No PowerShell, suba a API com `$env:PORT=3001; npm run start:dev` e crie o arquivo `frontend/.env.local` num editor de texto, com a linha `VITE_API_URL=http://localhost:3001`.

## Testes

Em outro terminal, a partir da raiz (a API não precisa estar rodando):

```bash
cd backend
npm test
```

Os testes do `UsersService` cobrem criação, busca, edição, exclusão, usuário inexistente e email duplicado. Rode sempre pelos scripts do npm: eles passam a flag `--experimental-vm-modules`, de que o Jest precisa para carregar os pacotes do NestJS 12. Por causa dela, o Node mostra o aviso `ExperimentalWarning: VM Modules is an experimental feature`, que é esperado.

## API

| Método | Rota | O que faz | Sucesso | Erros |
|---|---|---|---|---|
| `GET` | `/users` | Lista os usuários | 200 | |
| `GET` | `/users/:id` | Busca um usuário | 200 | 404 |
| `POST` | `/users` | Cria um usuário | 201 | 400, 409 |
| `PATCH` | `/users/:id` | Altera os campos enviados | 200 | 400, 404, 409 |
| `DELETE` | `/users/:id` | Exclui um usuário | 204 | 404 |

Exemplo de criação (se a API estiver em outra porta, troque o `3000`):

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@exemplo.com","role":"dev"}'
```

Resposta (`201 Created`):

```json
{
  "id": "1d24cdf9-49bf-40d3-9a98-ed86405f2828",
  "name": "Ana",
  "email": "ana@exemplo.com",
  "role": "dev",
  "createdAt": "2026-10-16T22:44:17.339Z"
}
```

### Regras

- `name` e `email` são obrigatórios, e o `email` precisa ter um formato válido. O `role` é opcional.
- O email não pode se repetir, nem na criação nem na edição, e a comparação ignora maiúsculas e minúsculas. Ele é salvo em minúsculas.
- O `id` (UUID) e o `createdAt` são gerados pelo backend. Se vierem no corpo da requisição, são ignorados, assim como qualquer campo além de `name`, `email` e `role`.
- No `PATCH`, só os campos enviados são alterados.

Os erros seguem o formato padrão do NestJS. Erros de validação trazem a lista de mensagens, como nesta resposta a `{"name":"","email":"invalido"}`:

```json
{
  "message": ["O nome é obrigatório", "O email precisa ser um email válido"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### Por que 409 para email duplicado

O enunciado cita o 400 entre os exemplos de status. Para email duplicado, a API responde `409 Conflict`, porque a requisição é válida, mas entra em conflito com um usuário que já existe. O 400 fica para dados inválidos.

## Estrutura

```text
backend/src/main.ts       porta, CORS e validação global (ValidationPipe)
backend/src/users/        controller, service, DTOs, entidade e testes
frontend/src/App.tsx      estado da tela e ações de criar, editar e excluir
frontend/src/api/         chamadas à API
frontend/src/components/  tabela e formulário
frontend/src/types/       tipos do usuário
```

## Outros comandos

| Pasta | Comando | Para quê |
|---|---|---|
| backend | `npm run build` e depois `npm run start:prod` | compila e roda a API sem o modo watch (pare o `start:dev` antes, ou use outra porta com `PORT`) |
| backend | `npm run lint` | confere o código com o oxlint |
| frontend | `npm run build` | confere os tipos e gera o build em `dist/` |
| frontend | `npm run lint` | confere o código com o oxlint |
