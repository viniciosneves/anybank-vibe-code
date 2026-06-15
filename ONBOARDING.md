# Onboarding — Anybank

Bem-vindo(a) ao **Anybank**, um demo de banco online. Este documento te dá uma visão geral
do projeto e deixa claro qual é o próximo trabalho a ser feito: o **CRUD de transações bancárias**.

> Dica: o `CLAUDE.md` na raiz tem o detalhamento técnico de arquitetura e comandos. Este
> arquivo é o "ponto de partida" para quem está chegando agora.

## O que é o projeto

Anybank é um banco online de demonstração, dividido em dois apps que compartilham um Postgres:

| App        | Pasta            | Stack                                   |
| ---------- | ---------------- | --------------------------------------- |
| Frontend   | `apps/frontend`  | Angular 21 (standalone) + Tailwind v4   |
| Backend    | `apps/backend`   | Spring Boot 3.5 / Java 21 + JPA + Flyway|
| Banco      | `docker compose` | PostgreSQL                              |

Toda a UI do produto está em **português (pt-BR)**.

## Como rodar

Tudo é orquestrado pelo `Makefile` na raiz:

```bash
make install     # instala deps do frontend
make db-up       # sobe o Postgres (necessário antes do backend)
make dev         # roda backend + frontend juntos
```

- Frontend: http://localhost:4200
- Backend: http://localhost:8080 (Swagger em `/swagger-ui.html`)

Outros atalhos úteis: `make test`, `make test-e2e`, `make build`, `make db-down`, `make clean`.

> O backend usa `ddl-auto: validate` + Flyway: o **schema é dono do Flyway**. Qualquer
> mudança de banco precisa de uma nova migration versionada em
> `apps/backend/src/main/resources/db/migration` (ex.: `V2__...sql`).

## O que já existe hoje

### Autenticação (pronto)

O fluxo de auth está implementado de ponta a ponta:

- **Backend** (`com.anybank.backend.auth`): `/auth/register | login | refresh | logout`.
  Access token é um JWT curto (HS256, 15min); refresh token é opaco, persistido em
  `refresh_tokens` e revogável (7 dias).
- **Frontend** (`core/auth/`): `AuthService` chama o backend, guarda tokens e usuário no
  `localStorage` (`anybank.*`), e o `authGuard` protege a rota `/inicio`.

### Tela de início / dashboard (UI pronta, sem dados reais)

Rota `/inicio` (`pages/inicio/`) — é aqui que mora o trabalho pendente. A tela já tem o
layout montado com três blocos:

1. **`BalanceCard`** — saudação + saldo do usuário.
2. **`TransactionForm`** (`organisms/transaction-form/`) — formulário para criar uma nova
   transação. Hoje emite um objeto `NewTransaction { type, amount }` via `output()`.
3. **`StatementCard`** (`organisms/statement-card/`) — extrato, lista de `StatementItem
   { amount, date, negative? }`.

**Porém, tudo está mockado/vazio:**

```ts
// pages/inicio/inicio.ts
protected readonly balance = 'R$ 0,00';          // saldo fixo
protected readonly statement: StatementItem[] = []; // extrato vazio

protected onTransaction(transaction: NewTransaction): void {
  console.log('Nova transação', transaction);     // só dá console.log, não persiste
}
```

Ou seja: a UI existe, mas **não há backend de transações, nem chamada HTTP, nem persistência**.

## TODO: CRUD de transações bancárias

O objetivo do próximo ciclo é tornar a tela de início funcional, implementando o CRUD de
transações de ponta a ponta. Em alto nível:

### Backend

- [ ] Criar o pacote `com.anybank.backend.transaction` (seguindo o padrão por feature, como
      `auth`/`user`).
- [ ] Migration Flyway `V2__transactions.sql` criando a tabela `transactions` (id, usuário,
      tipo, valor, data, etc.) — lembre que o schema é dono do Flyway.
- [ ] Entidade JPA `Transaction` + repositório.
- [ ] `TransactionController` + `TransactionService` com os endpoints CRUD, protegidos por
      bearer token (apenas transações do usuário autenticado):
  - `POST   /transactions`        — criar (Create)
  - `GET    /transactions`        — listar/extrato do usuário (Read)
  - `GET    /transactions/{id}`   — detalhar (Read)
  - `PUT    /transactions/{id}`   — editar (Update)
  - `DELETE /transactions/{id}`   — remover (Delete)
- [ ] (Opcional) endpoint/derivação de **saldo** a partir das transações.
- [ ] DTOs com Bean Validation em `transaction/dto` e mapeamento de erros no padrão do
      `AuthExceptionHandler`.

### Frontend

- [ ] **Criar um HTTP interceptor** para anexar o access token (`anybank.*`) nas requisições
      — hoje **não existe interceptor**; o token é guardado mas não enviado automaticamente.
      (Ver nota no `CLAUDE.md`.)
- [ ] `TransactionService` em `core/` chamando os endpoints acima (base URL vem de
      `src/environments/environment.ts`).
- [ ] Ligar o `TransactionForm`: `onTransaction()` deve **criar** a transação via API em vez
      de `console.log`.
- [ ] Preencher o `StatementCard` com as transações reais (Read) e calcular/exibir o **saldo**
      no `BalanceCard` (em vez do `R$ 0,00` fixo).
- [ ] Suporte a **editar** e **excluir** transações no extrato (Update/Delete).
- [ ] Tratar estados de loading/erro e atualizar a lista após cada operação.

### Testes

- [ ] Testes de unidade do backend (`./mvnw test`) para o service/controller de transações.
- [ ] Testes de unidade do frontend (Vitest) para `TransactionService` e componentes.
- [ ] (Desejável) cobrir o fluxo na suíte e2e Playwright (`make test-e2e`).

## Por onde começar

1. Suba o ambiente: `make db-up && make dev`.
2. Faça login/cadastro e abra `/inicio` para ver a tela que precisa ganhar vida.
3. Comece pelo backend (migration → entidade → service → controller) e use o Swagger para
   validar os endpoints.
4. Depois conecte o frontend (interceptor → service → ligar form e extrato).
