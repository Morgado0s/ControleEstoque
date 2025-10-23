# 📦 Inventory Control

**Sistema Completo de Controle de Estoque Brasileiro**

Uma aplicação full-stack para gerenciamento completo de estoque, desenvolvida com React + TypeScript no frontend e Flask + MySQL no backend.

## 🚀 Visão Geral

O Inventory Control é um sistema robusto de gerenciamento de estoque projetado para pequenas e médias empresas brasileiras. Oferece controle completo sobre produtos, categorias, armazéns e movimentações, com interface intuitiva e funcionalidades avançadas.

### ✨ Funcionalidades Principais

- **🏠 Dashboard**: Métricas em tempo real com visualização de dados
- **📦 Gestão de Produtos**: CRUD completo com controle de estoque mínimo
- **🏪 Gestão de Armazéns**: Localização física dos produtos
- **🏷️ Gestão de Categorias**: Organização inteligente de produtos
- **📊 Controle de Movimentações**: Registro detalhado de entradas e saídas
- **👥 Gestão de Usuários**: Sistema de autenticação e perfis
- **📈 Relatórios**: Análise de dados e métricas de negócio

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** - Interface moderna e type-safe
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes UI profissionais
- **TanStack Query** - Gerenciamento de estado e cache
- **React Router v6** - Navegação client-side
- **Lucide React** - Ícones modernos

### Backend
- **Python** - Linguagem de Programação
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM Python
- **MySQL 8.0** - Banco de dados relacional
- **Flask-CORS** - Compartilhamento de recursos entre origens

### DevOps
- **Docker** + **Docker Compose** - Containerização completa
- **Gunicorn** - Servidor WSGI para produção

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Python 3.12+ (para desenvolvimento local)
- MySQL 8.0+ (se não usar Docker)

## 🚀 Início Rápido

### 1. Clone o Repositório
```bash
git clone https://github.com/Migguell/InventoryControl.git
cd inventory-control
```

### 2. Configurar Variáveis de Ambiente
```bash
cp api/.env.example api/.env
# Edite api/.env com suas configurações
```

### 3. Iniciar com Docker (Recomendado)
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### 4. Acessar a Aplicação
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/health

### 5. Login Padrão
- **Email**: admin@inventory.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

```
inventory-control/
├── 📂 api/                     # Backend Flask
│   ├── 📂 entries/             # Movimentações de entrada
│   ├── 📂 exits/              # Movimentações de saída
│   ├── 📂 products/           # Gestão de produtos
│   ├── 📂 warehouses/         # Gestão de armazéns
│   ├── 📂 categories/         # Gestão de categorias
│   ├── 📂 users/              # Gestão de usuários
│   ├── 📂 utils/              # Utilitários do backend
│   └── app.py                 # Aplicação Flask principal
├── 📂 app/                    # Frontend React
│   ├── 📂 src/
│   │   ├── 📂 components/      # Componentes reutilizáveis
│   │   ├── 📂 contexts/        # Contextos React
│   │   ├── 📂 hooks/           # Hooks personalizados
│   │   ├── 📂 lib/             # Utilitários do frontend
│   │   ├── 📂 pages/           # Páginas da aplicação
│   │   ├── 📂 services/        # Serviços de API
│   │   └── 📂 types/           # Tipos TypeScript
│   └── package.json
├── 📄 docker-compose.yml       # Orquestração Docker
├── 📄 README.md                # Este arquivo
└── 📄 .env.example             # Variáveis de ambiente exemplo
```

## 🌐 API Endpoints

### Produtos
- `GET /products/read/all` - Listar todos os produtos
- `GET /products/read/{id}` - Obter produto específico
- `POST /products/create` - Criar novo produto
- `PUT /products/update/{id}` - Atualizar produto
- `DELETE /products/delete/{id}` - Excluir produto (soft delete)

### Armazéns
- `GET /warehouses/read/all` - Listar todos os armazéns
- `GET /warehouses/read/{id}` - Obter armazém específico
- `POST /warehouses/create` - Criar novo armazém
- `PUT /warehouses/update/{id}` - Atualizar armazém
- `DELETE /warehouses/delete/{id}` - Excluir armazém

### Categorias
- `GET /categories/read/all` - Listar todas as categorias
- `GET /categories/read/{id}` - Obter categoria específica
- `POST /categories/create` - Criar nova categoria
- `PUT /categories/update/{id}` - Atualizar categoria
- `DELETE /categories/delete/{id}` - Excluir categoria

### Movimentações
- `GET /entries/read/all` - Listar todas as entradas
- `POST /entries/create` - Registrar nova entrada
- `DELETE /entries/delete/{id}` - Excluir entrada
- `GET /exits/read/all` - Listar todas as saídas
- `POST /exits/create` - Registrar nova saída
- `DELETE /exits/delete/{id}` - Excluir saída

### Usuários
- `POST /users/login` - Autenticar usuário
- `GET /users/me` - Obter perfil do usuário atual
- `POST /users/change-password` - Alterar senha

## 🎮 Interface do Usuário

### Páginas Principais

1. **Dashboard** (`/`)
   - Visão geral com métricas principais
   - Produtos com estoque baixo
   - Últimas movimentações
   - Valor total do estoque

2. **Estoque Atual** (`/estoque`)
   - Lista completa de produtos com status visual
   - Filtros por categoria e armazém
   - Busca instantânea
   - Movimentações rápidas

3. **Movimentações** (`/movimentacoes`)
   - Histórico completo de entradas e saídas
   - Registro de novas movimentações
   - Ordenação e filtragem
   - **Exclusão de movimentações incorretas**

4. **Produtos** (`/produtos`)
   - CRUD completo de produtos
   - **Edição de produtos existentes**
   - Controle de estoque mínimo
   - Associação com categorias e armazéns

5. **Armazéns** (`/armazens`)
   - Gestão de locais de armazenamento
   - **Edição de armazéns existentes**
   - Estatísticas de produtos por armazém

6. **Categorias** (`/categorias`) ⭐ **NOVO**
   - **CRUD completo de categorias**
   - Organização de produtos
   - Proteção contra exclusão com produtos associados

### Recursos da Interface

- **🎨 Design Responsivo**: Funciona em desktop e mobile
- **🌙 Modo Escuro**: Proteção para os olhos (planejado)
- **🔍 Busca Instantânea**: Encontre produtos rapidamente
- **📊 Status Visual**: Indicadores de estoque crítico/atenção/sucesso
- **💾 Cache Inteligente**: Performance otimizada com React Query
- **🔐 Autenticação Segura**: JWT com refresh tokens
- **📱 Toast Notifications**: Feedback visual de ações

## 🔧 Configuração

### Variáveis de Ambiente (Backend)
```bash
# Database
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=inventory_db
DB_USER=inventory_user
DB_PASSWORD=your_password
DB_ROOT_PASSWORD=root_password
```

### Portas Padrão
- **Frontend (Vite)**: 3000
- **Backend (Flask)**: 5001
- **MySQL**: 3306

## 🧪 Gerenciamento e Testes via Docker

### Comandos Docker Úteis
```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status dos serviços
docker-compose ps

# Visualizar logs em tempo real
docker-compose logs -f

# Logs de serviço específico
docker-compose logs -f api
docker-compose logs -f frontend

# Reiniciar serviços
docker-compose restart

# Parar todos os serviços
docker-compose down

# Remover volumes (cuidado - apaga dados)
docker-compose down -v
```

### Testes e Verificação
```bash
# Verificar saúde da API
curl http://localhost:5001/health

# Testar endpoints principais
curl http://localhost:5001/products/read/all
curl http://localhost:5001/warehouses/read/all

# Acessar logs de erro
docker-compose logs api | grep ERROR
```

## 📊 Funcionalidades Implementadas

### ✅ CRUD Completo
- **Produtos**: Criar, Ler, Atualizar, Excluir
- **Armazéns**: Criar, Ler, Atualizar, Excluir
- **Categorias**: Criar, Ler, Atualizar, Excluir
- **Movimentações**: Criar, Ler, **Excluir** (hard delete)
- **Usuários**: Ler, Atualizar (soft delete)

### ✅ Validações e Regras de Negócio
- **Integridade Referencial**: Não permite excluir categorias/armazéns com produtos
- **Estoque Mínimo**: Alertas visuais para produtos críticos
- **Validação de Dados**: Campos obrigatórios e formatos válidos
- **Soft Delete**: Exclusão lógica para dados importantes

### ✅ Performance e UX
- **Cache React Query**: Dados cacheados inteligentemente
- **Invalidação Automática**: Updates em tempo real
- **Loading States**: Feedback visual durante operações
- **Error Handling**: Tratamento elegante de erros

## 🔐 Segurança

- **bcrypt**: Hash de senhas com salt
- **CORS**: Configuração segura para frontend
- **Input Validation**: Validação no backend e frontend
- **SQL Injection Protection**: SQLAlchemy ORM seguro

## 👥 Autores

- **Seu Nome** - *Desenvolvedor Principal* - [Migguell](https://github.com/Migguell)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Framework frontend
- [Flask](https://flask.palletsprojects.com/) - Framework backend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Lucide](https://lucide.dev/) - Icones

---

**🎉 Obrigado por usar Inventory Control!**

Se você gostou do projeto, por favor considere dar uma ⭐️ no GitHub!