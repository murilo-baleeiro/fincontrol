# FinControl

<img src="/public/images/home.jpg" alt="Pagina Inicial" width="400" />

FinControl é uma aplicação web desenvolvida para gerenciar finanças pessoais, permitindo o controle de despesas, cartões de crédito, transações e muito mais. A aplicação é construída utilizando tecnologias modernas para oferecer uma experiência rápida e intuitiva.

---

## 🚀 Funcionalidades

- **Gestão de Despesas**: Controle e visualize suas despesas de forma organizada.
- **Cartões de Crédito**: Gerencie seus cartões de crédito e acompanhe o uso.
- **Transações**: Registre e acompanhe suas transações financeiras.
- **Relatórios**: Geração de relatórios detalhados sobre suas finanças.
- **Configurações Personalizadas**: Ajuste categorias de pagamento e outras preferências.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework React para renderização do lado do servidor e geração de sites estáticos.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **PostCSS**: Ferramenta para transformar CSS com plugins.
- **Turbopack**: Ferramenta de empacotamento para otimização de desempenho.
- **React**: Biblioteca para construção de interfaces de usuário.
- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.

---

## 📂 Estrutura do Projeto

```plaintext
.
├── app/
│   ├── api/                # Endpoints da API
│   ├── configuration/      # Configurações da aplicação
│   ├── credit-cards/       # Gerenciamento de cartões de crédito
│   ├── expenses/           # Controle de despesas
│   ├── transactions/       # Registro de transações
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página inicial
├── components/             # Componentes reutilizáveis
├── lib/                    # Bibliotecas e utilitários
├── public/images/          # Imagens estáticas
├── utils/                  # Funções utilitárias
└── .next/                  # Arquivos gerados pelo Next.js
```

---

## � Autenticação por Código de Acesso

A aplicação agora exige que o usuário informe um *código de acesso* presente na tabela `access_code` do banco de dados. Ao enviar um código válido, um token JWT com validade de 1 hora é gerado e armazenado em um cookie **HttpOnly**. Todas as rotas da aplicação (páginas e API) são protegidas; se o token estiver ausente, inválido ou expirado, o usuário será redirecionado automaticamente para `/auth`.

### Variáveis de ambiente necessárias

- `DB_HOST` , `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` – configuração do MySQL (já existentes).
- `ACCESS_TOKEN_SECRET` – segredo usado para assinar o JWT (defina um valor forte, por exemplo `openssl rand -hex 32`).

### Dependências adicionais

Execute os comandos a seguir para instalar as bibliotecas necessárias:

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

Depois disso, rode `npm install` normalmente e inicie o servidor com `npm run dev`.

## �📸 Capturas de Tela

<div style="display: flex; flex-direction: row;">
    <img src="/public/images/transacoes.jpg" alt="Pagina de Trasacoes" width="400" />
    <img src="/public/images/cartoes.jpg" alt="Pagina de Cartoes de Credito" width="400" />
    <img src="/public/images/categorias.jpg" alt="Pagina de Categorias" width="400" />
</div>
