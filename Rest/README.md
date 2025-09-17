# Sistema de Gestão de Alunos

Sistema completo para gerenciamento de alunos com integração à API ViaCEP e banco de dados MongoDB.

## 🚀 Funcionalidades

- **Cadastro de Alunos**: Formulário completo com validação
- **Integração ViaCEP**: Busca automática de endereço por CEP
- **Listagem de Alunos**: Tabela responsiva com todas as informações
- **Edição de Dados**: Modal para editar informações do aluno
- **Visualização Detalhada**: Modal para visualizar dados completos
- **Exclusão de Alunos**: Confirmação antes da exclusão
- **Gerenciamento de Cursos**: Adicionar/remover cursos por aluno
- **Interface Responsiva**: Design moderno com Bootstrap 5

## 📋 Estrutura do Projeto

```
Rest/
├── Server/
│   └── index.js          # Servidor Node.js com Express
├── public/
│   ├── index.html        # Interface principal
│   ├── styles.css        # Estilos personalizados
│   └── script.js         # JavaScript da aplicação
├── package.json          # Dependências do projeto
└── README.md            # Este arquivo
```

## 🗄️ Estrutura do Banco de Dados

### Modelo Aluno (MongoDB)

```javascript
{
  _id: ObjectId,
  matricula: String (única, obrigatória),
  nome: String (obrigatório),
  endereco: {
    cep: String (obrigatório),
    logradouro: String,
    cidade: String,
    bairro: String,
    estado: String,
    numero: String,
    complemento: String
  },
  cursos: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (instalado e rodando)
- NPM ou Yarn

### Passos para Instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd C:\Users\Alunos\Documents\mobile2\Rest
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o MongoDB**
   - Certifique-se de que o MongoDB está rodando na porta padrão (27017)
   - O banco de dados será criado automaticamente como "FatecVotorantim"

4. **Inicie o servidor**
   ```bash
   npm start
   ```
   
   Para desenvolvimento com auto-reload:
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Abra seu navegador em: `http://localhost:3000`

## 📚 Como Usar

### 1. Adicionar Aluno

1. Clique em "Adicionar Aluno"
2. Preencha a matrícula e nome (campos obrigatórios)
3. Digite o CEP e clique no botão de busca para preenchimento automático
4. Complete o número e complemento do endereço
5. Adicione cursos (opcional)
6. Clique em "Salvar Aluno"

### 2. Listar Alunos

1. Clique em "Listar Alunos"
2. Visualize todos os alunos cadastrados
3. Use os botões de ação:
   - 👁️ **Visualizar**: Ver detalhes completos
   - ✏️ **Editar**: Modificar dados do aluno
   - 🗑️ **Excluir**: Remover aluno (com confirmação)

### 3. Editar Aluno

1. Na lista de alunos, clique no botão "Editar"
2. Modifique os dados desejados
3. Use a busca de CEP para atualizar endereço
4. Adicione ou remova cursos
5. Clique em "Salvar"

### 4. Visualizar Detalhes

1. Na lista de alunos, clique no botão "Visualizar"
2. Veja todas as informações do aluno
3. Os campos ficam desabilitados para visualização apenas

## 🔌 API Endpoints

### ViaCEP
- `GET /api/cep/:cep` - Busca dados do CEP

### Alunos
- `GET /api/alunos` - Lista todos os alunos
- `GET /api/alunos/:id` - Busca aluno por ID
- `POST /api/alunos` - Cria novo aluno
- `PUT /api/alunos/:id` - Atualiza aluno
- `DELETE /api/alunos/:id` - Remove aluno

## 🎨 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Axios** - Cliente HTTP para ViaCEP

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript (ES6+)** - Funcionalidades
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Ícones

## 🔧 Configurações Avançadas

### Alterar Porta do Servidor
No arquivo `Server/index.js`, modifique:
```javascript
const port = 3000; // Altere para a porta desejada
```

### Alterar Banco de Dados
No arquivo `Server/index.js`, modifique:
```javascript
let url = "mongodb://localhost:27017/FatecVotorantim"; // Altere o nome do banco
```

## 🐛 Solução de Problemas

### Erro de Conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme se a porta 27017 está disponível
- Verifique as credenciais de acesso

### Erro de CEP não encontrado
- Verifique se o CEP tem 8 dígitos
- Confirme se a conexão com a internet está ativa
- A API ViaCEP pode estar temporariamente indisponível

### Erro de Matrícula duplicada
- Cada matrícula deve ser única
- Verifique se já existe um aluno com a mesma matrícula

## 📝 Exemplo de Uso da API

### Criar Aluno via API
```bash
curl -X POST http://localhost:3000/api/alunos \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "2024001",
    "nome": "João Silva",
    "endereco": {
      "cep": "01310-100",
      "logradouro": "Avenida Paulista",
      "numero": "1000",
      "complemento": "Apto 101",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP"
    },
    "cursos": ["Engenharia de Software", "Banco de Dados"]
  }'
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Sistema desenvolvido para gestão acadêmica com integração ViaCEP e MongoDB.

---

**Desenvolvido com ❤️ para facilitar a gestão de alunos**
