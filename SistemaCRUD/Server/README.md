# Servidor REST API - Sistema CRUD de Produtos

Servidor Node.js/Express com MongoDB para gerenciamento de produtos via API REST.

## Pré-requisitos

- Node.js instalado
- MongoDB instalado e rodando
- npm ou yarn

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Certifique-se de que o MongoDB está rodando:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
# ou
mongod
```

## Configuração

O servidor está configurado para:
- **Porta**: 3000
- **MongoDB**: `mongodb://localhost:27017/SistemaCRUD`
- **IP da rede**: `0.0.0.0` (acessível de outros dispositivos)

Para alterar a configuração, edite o arquivo `index.js`.

## Uso

Inicie o servidor:
```bash
npm start
```

Ou em modo desenvolvimento (com nodemon):
```bash
npm run dev
```

## Endpoints da API

### Listar todos os produtos
```
GET /api/produtos
```

### Buscar produto por ID
```
GET /api/produtos/:id
```

### Criar novo produto
```
POST /api/produtos
Content-Type: application/json

{
  "nome": "Produto Exemplo",
  "descricao": "Descrição do produto",
  "preco": 29.90,
  "quantidade": 10
}
```

### Atualizar produto
```
PUT /api/produtos/:id
Content-Type: application/json

{
  "nome": "Produto Atualizado",
  "descricao": "Nova descrição",
  "preco": 39.90,
  "quantidade": 15
}
```

### Deletar produto
```
DELETE /api/produtos/:id
```

## Estrutura do Banco de Dados

**Coleção**: `produtos`

**Schema**:
```javascript
{
  nome: String (obrigatório),
  descricao: String (opcional),
  preco: Number (obrigatório, mínimo 0),
  quantidade: Number (obrigatório, mínimo 0),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

## Notas

- O servidor aceita requisições de qualquer origem (CORS habilitado)
- A validação é feita no servidor antes de salvar
- Os produtos são ordenados por data de criação (mais recentes primeiro)
- O servidor escuta em `0.0.0.0` para ser acessível na rede local

