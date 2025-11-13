// Configuração da API REST (MongoDB)
const API_URL = 'http://192.168.50.60:3000/api/produtos';

// Listar produtos
async function ListarProdutos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Erro ao listar produtos', error);
        return [];
    }
}

// Buscar produto por ID
async function BuscarProdutoPorId(id: string) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Erro ao buscar produto', error);
        return null;
    }
}

// Inserir produto
async function InserirProduto(
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number
) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco,
                quantidade
            }),
        });
        const data = await response.json();
        return response.ok;
    } catch (error) {
        console.log('Erro ao inserir produto', error);
        return false;
    }
}

// Atualizar produto
async function AtualizarProduto(
    id: string,
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number
) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco,
                quantidade
            }),
        });
        return response.ok;
    } catch (error) {
        console.log('Erro ao atualizar produto', error);
        return false;
    }
}

// Deletar produto
async function DeletarProduto(id: string) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.log('Erro ao deletar produto', error);
        return false;
    }
}

// ========== FUNÇÕES DE USUÁRIOS ==========
const API_URL_USUARIOS = 'http://192.168.50.60:3000/api/usuarios';

// Inserir usuário
async function InserirUsuario(usuario: string, email: string, senha: string) {
    try {
        const response = await fetch(API_URL_USUARIOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario,
                email,
                senha
            }),
        });
        return response.ok;
    } catch (error) {
        console.log('Erro ao inserir usuário', error);
        return false;
    }
}

// Verificar login
async function VerificarLogin(usuario: string, senha: string) {
    try {
        const response = await fetch(`${API_URL_USUARIOS}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario,
                senha
            }),
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.log('Erro ao verificar login', error);
        return null;
    }
}

// Buscar usuário por nome
async function BuscarUsuarioPorNome(usuario: string) {
    try {
        const response = await fetch(`${API_URL_USUARIOS}/buscar/${usuario}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.log('Erro ao buscar usuário', error);
        return null;
    }
}

// Buscar usuário por email
async function BuscarUsuarioPorEmail(email: string) {
    try {
        const response = await fetch(`${API_URL_USUARIOS}/email/${email}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    } catch (error) {
        console.log('Erro ao buscar usuário por email', error);
        return null;
    }
}

export {
    ListarProdutos,
    BuscarProdutoPorId,
    InserirProduto,
    AtualizarProduto,
    DeletarProduto,
    InserirUsuario,
    VerificarLogin,
    BuscarUsuarioPorNome,
    BuscarUsuarioPorEmail
};

