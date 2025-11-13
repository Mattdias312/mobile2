// Servidor REST API para MongoDB - Sistema CRUD de Produtos
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;

// Criar um objeto express
const app = express();

// Vincular o middleware ao express
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Permissão para usar outros métodos HTTP
app.use(methodOverride('X-HTTP-Method'));

// Fazer a conexão com o banco de dados mongoose
let url = "mongodb://localhost:27017/SistemaCRUD";

// Testar a conexão
mongoose.connect(url)
  .then(() => console.log('MongoDB connected...'))
  .catch(() => console.log("Erro na conexão com MongoDB"));

// Estrutura do modelo Produto
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    default: ''
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  quantidade: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Produto = mongoose.model('Produto', produtoSchema);

// Estrutura do modelo Usuario
const usuarioSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ========== ROTAS DA API ==========

// Listar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find({}).sort({ createdAt: -1 });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    // Validação
    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    if (preco <= 0) {
      return res.status(400).json({ error: 'Preço deve ser maior que zero' });
    }

    const produto = new Produto({
      nome,
      descricao: descricao || '',
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade) || 0
    });

    await produto.save();
    res.status(201).json({ message: 'Produto criado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto: ' + error.message });
  }
});

// Atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    // Validação
    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }

    if (preco <= 0) {
      return res.status(400).json({ error: 'Preço deve ser maior que zero' });
    }

    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        descricao: descricao || '',
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade) || 0
      },
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto: ' + error.message });
  }
});

// Deletar produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto: ' + error.message });
  }
});

// ========== ROTAS DE USUÁRIOS ==========

// Criar novo usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const { usuario, email, senha } = req.body;

    // Validação
    if (!usuario || !email || !senha) {
      return res.status(400).json({ error: 'Usuário, email e senha são obrigatórios' });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.findOne({ usuario });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Verificar se email já existe
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const novoUsuario = new Usuario({
      usuario,
      email,
      senha
    });

    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário criado com sucesso', usuario: novoUsuario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Usuário ou e-mail já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
  }
});

// Verificar login
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    const user = await Usuario.findOne({ usuario, senha });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    res.json({ message: 'Login realizado com sucesso', usuario: user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar login: ' + error.message });
  }
});

// Buscar usuário por nome
app.get('/api/usuarios/buscar/:usuario', async (req, res) => {
  try {
    const user = await Usuario.findOne({ usuario: req.params.usuario });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
  }
});

// Buscar usuário por email
app.get('/api/usuarios/email/:email', async (req, res) => {
  try {
    const user = await Usuario.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'E-mail não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário: ' + error.message });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`API acessível em http://192.168.50.60:${port}`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET    /api/produtos - Listar todos os produtos`);
  console.log(`  GET    /api/produtos/:id - Buscar produto por ID`);
  console.log(`  POST   /api/produtos - Criar novo produto`);
  console.log(`  PUT    /api/produtos/:id - Atualizar produto`);
  console.log(`  DELETE /api/produtos/:id - Deletar produto`);
  console.log(`  POST   /api/usuarios - Criar novo usuário`);
  console.log(`  POST   /api/usuarios/login - Fazer login`);
  console.log(`  GET    /api/usuarios/buscar/:usuario - Buscar usuário por nome`);
  console.log(`  GET    /api/usuarios/email/:email - Buscar usuário por email`);
});

