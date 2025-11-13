# Sistema CRUD - Gerenciamento de Produtos

Sistema completo de CRUD (Create, Read, Update, Delete) para gerenciamento de produtos com suporte a dois tipos de banco de dados.

## Funcionalidades

- ✅ **Tela de Splash Screen** - Tela inicial com animação
- ✅ **Seleção de Banco de Dados** - Escolha entre SQLite (local) ou REST API (MongoDB)
- ✅ **CRUD Completo** - Criar, Listar, Visualizar, Editar e Excluir produtos
- ✅ **Interface Moderna** - Design limpo e responsivo

## Estrutura do Projeto

```
SistemaCRUD/
├── App.tsx                 # Componente principal com navegação
├── Conf/
│   ├── Bd.tsx             # Configuração SQLite
│   └── RestApi.tsx        # Configuração REST API
├── Telas/
│   ├── SplashScreen.tsx   # Tela de splash
│   ├── SelecaoBanco.tsx   # Tela de seleção de banco
│   ├── ListaProdutos.tsx  # Lista de produtos
│   ├── FormularioProduto.tsx # Formulário para adicionar/editar
│   └── VisualizarProduto.tsx # Visualização detalhada
└── assets/                # Imagens e ícones
```

## Instalação

1. Navegue até a pasta do projeto:
```bash
cd SistemaCRUD
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto:
```bash
npm start
```

## Uso

### SQLite (Banco Local)

1. Ao iniciar o app, você verá a tela de Splash
2. Em seguida, escolha "SQLite" na tela de seleção
3. O banco será criado automaticamente no dispositivo
4. Você pode começar a gerenciar produtos imediatamente

### REST API (MongoDB)

1. Certifique-se de que o servidor REST está rodando (veja seção abaixo)
2. Ao iniciar o app, escolha "REST API (MongoDB)" na tela de seleção
3. Configure a URL da API no arquivo `Conf/RestApi.tsx` se necessário
4. O padrão é: `http://192.168.50.60:3000/api/produtos`

## Configuração do Servidor REST (MongoDB)

Para usar o REST API com MongoDB, você precisa iniciar o servidor que está na pasta `Server/`.

### Passos para configurar o servidor MongoDB:

1. **Instalar MongoDB** (se ainda não tiver):
   - Baixe e instale o MongoDB Community Edition
   - Inicie o serviço MongoDB

2. **Configurar o servidor Node.js**:
   ```bash
   cd Server
   npm install
   ```

3. **Iniciar o servidor**:
   ```bash
   npm start
   ```

4. **Configurar a URL da API** (se necessário):
   - Edite o arquivo `Conf/RestApi.tsx`
   - Altere a constante `API_URL` para o IP do seu servidor
   - Padrão: `http://192.168.50.60:3000/api/produtos`

O servidor já está configurado e pronto para uso! Ele cria automaticamente:
- Conexão com MongoDB em `mongodb://localhost:27017/SistemaCRUD`
- Rotas CRUD completas para produtos
- Validação de dados
- Tratamento de erros

## Funcionalidades do CRUD

### Criar Produto
- Nome (obrigatório)
- Descrição (opcional)
- Preço (obrigatório, maior que zero)
- Quantidade (obrigatório, maior ou igual a zero)

### Listar Produtos
- Visualização em cards
- Informações principais: nome, preço e quantidade
- Botões para Ver, Editar e Excluir

### Visualizar Produto
- Detalhes completos do produto
- Formatação de preço em Real (R$)
- Data de criação

### Editar Produto
- Formulário pré-preenchido
- Validação de campos
- Atualização no banco selecionado

### Excluir Produto
- Confirmação antes de excluir
- Exclusão permanente

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- SQLite (expo-sqlite)
- REST API (fetch)

## Notas

- O sistema funciona offline com SQLite
- Para usar REST API, é necessário um servidor rodando
- A URL da API pode ser configurada em `Conf/RestApi.tsx`
- Os dados do SQLite são armazenados localmente no dispositivo

