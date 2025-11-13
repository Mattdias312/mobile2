import * as SQLite from 'expo-sqlite';

// Criar banco de dados
async function CriaBanco() {
    try {
        const db = await SQLite.openDatabaseAsync('sistemaCRUD.db');
        console.log('Banco de dados criado com sucesso');
        return db;
    } catch (error) {
        console.log('Erro ao criar o banco de dados', error);
        return null;
    }
}

// Criar tabelas
async function CriaTabela(database: SQLite.SQLiteDatabase) {
    try {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(100) NOT NULL,
                descricao TEXT,
                preco REAL NOT NULL,
                quantidade INTEGER DEFAULT 0,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario VARCHAR(100) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabelas criadas com sucesso');
    } catch (error) {
        console.log('Erro ao criar as tabelas', error);
    }
}

// Inserir produto
async function InserirProduto(
    database: SQLite.SQLiteDatabase,
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number
) {
    try {
        await database.runAsync(
            `INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)`,
            nome, descricao, preco, quantidade
        );
        console.log('Produto inserido com sucesso');
        return true;
    } catch (error) {
        console.log('Erro ao inserir o produto', error);
        return false;
    }
}

// Listar produtos
async function ListarProdutos(database: SQLite.SQLiteDatabase) {
    try {
        let produtos = await database.getAllAsync(`SELECT * FROM produtos ORDER BY id DESC`);
        return produtos;
    } catch (error) {
        console.log('Erro ao listar produtos', error);
        return [];
    }
}

// Buscar produto por ID
async function BuscarProdutoPorId(database: SQLite.SQLiteDatabase, id: number) {
    try {
        let produto = await database.getFirstAsync(`SELECT * FROM produtos WHERE id = ?`, id);
        return produto;
    } catch (error) {
        console.log('Erro ao buscar produto', error);
        return null;
    }
}

// Atualizar produto
async function AtualizarProduto(
    database: SQLite.SQLiteDatabase,
    id: number,
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number
) {
    try {
        await database.runAsync(
            `UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?`,
            nome, descricao, preco, quantidade, id
        );
        console.log('Produto atualizado com sucesso');
        return true;
    } catch (error) {
        console.log('Erro ao atualizar o produto', error);
        return false;
    }
}

// Deletar produto
async function DeletarProduto(database: SQLite.SQLiteDatabase, id: number) {
    try {
        await database.runAsync(`DELETE FROM produtos WHERE id = ?`, id);
        console.log('Produto deletado com sucesso');
        return true;
    } catch (error) {
        console.log('Erro ao deletar o produto', error);
        return false;
    }
}

// ========== FUNÇÕES DE USUÁRIOS ==========

// Inserir usuário
async function InserirUsuario(
    database: SQLite.SQLiteDatabase,
    usuario: string,
    email: string,
    senha: string
) {
    try {
        await database.runAsync(
            `INSERT INTO usuarios (usuario, email, senha) VALUES (?, ?, ?)`,
            usuario, email, senha
        );
        console.log('Usuário inserido com sucesso');
        return true;
    } catch (error) {
        console.log('Erro ao inserir usuário', error);
        return false;
    }
}

// Buscar usuário por nome de usuário
async function BuscarUsuarioPorNome(database: SQLite.SQLiteDatabase, usuario: string) {
    try {
        let user = await database.getFirstAsync(`SELECT * FROM usuarios WHERE usuario = ?`, usuario);
        return user;
    } catch (error) {
        console.log('Erro ao buscar usuário', error);
        return null;
    }
}

// Buscar usuário por email
async function BuscarUsuarioPorEmail(database: SQLite.SQLiteDatabase, email: string) {
    try {
        let user = await database.getFirstAsync(`SELECT * FROM usuarios WHERE email = ?`, email);
        return user;
    } catch (error) {
        console.log('Erro ao buscar usuário por email', error);
        return null;
    }
}

// Verificar login
async function VerificarLogin(database: SQLite.SQLiteDatabase, usuario: string, senha: string) {
    try {
        let user = await database.getFirstAsync(
            `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`,
            usuario, senha
        );
        return user;
    } catch (error) {
        console.log('Erro ao verificar login', error);
        return null;
    }
}

export {
    CriaBanco,
    CriaTabela,
    InserirProduto,
    ListarProdutos,
    BuscarProdutoPorId,
    AtualizarProduto,
    DeletarProduto,
    InserirUsuario,
    BuscarUsuarioPorNome,
    BuscarUsuarioPorEmail,
    VerificarLogin
};

