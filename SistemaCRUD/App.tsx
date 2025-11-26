import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Login from './Telas/Login';
import Cadastro from './Telas/Cadastro';
import SplashScreen from './Telas/SplashScreen';
import SelecaoBanco from './Telas/SelecaoBanco';
import ListaProdutos from './Telas/ListaProdutos';
import FormularioProduto from './Telas/FormularioProduto';
import VisualizarProduto from './Telas/VisualizarProduto';
import { CriaBanco, CriaTabela } from './Conf/Bd';

type TelaAtual =
    | 'login'
    | 'cadastro'
    | 'splash'
    | 'selecaoBanco'
    | 'lista'
    | 'adicionar'
    | 'editar'
    | 'visualizar';

interface Produto {
    id?: number | string;
    _id?: string;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
}

export default function App() {
    const [telaAtual, setTelaAtual] = useState<TelaAtual>('login');
    const [tipoBanco, setTipoBanco] = useState<'sqlite' | 'rest' | null>(null);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
    const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);

    useEffect(() => {
        // Inicializar banco SQLite se necessário
        if (tipoBanco === 'sqlite' && !db) {
            inicializarSQLite();
        }
    }, [tipoBanco]);

    const inicializarSQLite = async () => {
        try {
            const database = await CriaBanco();
            if (database) {
                await CriaTabela(database);
                setDb(database);
            }
        } catch (error) {
            console.log('Erro ao inicializar SQLite', error);
        }
    };

    const handleLogin = (usuario: string) => {
        setUsuarioLogado(usuario);
        setTelaAtual('splash');
    };

    const handleIrParaCadastro = () => {
        setTelaAtual('cadastro');
    };

    const handleVoltarParaLogin = () => {
        setTelaAtual('login');
    };

    const handleCadastrar = (usuario: string, senha: string) => {
        setUsuarioLogado(usuario);
        setTelaAtual('splash');
    };

    const handleSplashFinish = () => {
        setTelaAtual('selecaoBanco');
    };

    const handleSelecionarBanco = (tipo: 'sqlite' | 'rest') => {
        setTipoBanco(tipo);
        setTelaAtual('lista');
    };

    const handleAlterarBanco = () => {
        // Resetar o banco SQLite ao alterar
        if (tipoBanco === 'sqlite') {
            setDb(null);
        }
        setTelaAtual('selecaoBanco');
    };

    const handleAdicionar = () => {
        setProdutoSelecionado(null);
        setTelaAtual('adicionar');
    };

    const handleEditar = (produto: Produto) => {
        setProdutoSelecionado(produto);
        setTelaAtual('editar');
    };

    const handleVisualizar = (produto: Produto) => {
        setProdutoSelecionado(produto);
        setTelaAtual('visualizar');
    };

    const handleSalvar = () => {
        setTelaAtual('lista');
        setProdutoSelecionado(null);
    };

    const handleCancelar = () => {
        setTelaAtual('lista');
        setProdutoSelecionado(null);
    };

    const handleVoltar = () => {
        setTelaAtual('lista');
        setProdutoSelecionado(null);
    };

    const handleLogoff = () => {
        Alert.alert(
            'Confirmar Logoff',
            'Deseja realmente sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        setUsuarioLogado(null);
                        setTipoBanco(null);
                        setDb(null);
                        setProdutoSelecionado(null);
                        setTelaAtual('login');
                    },
                },
            ]
        );
    };

    const renderTela = () => {
        switch (telaAtual) {
            case 'login':
                return <Login onLogin={handleLogin} onIrParaCadastro={handleIrParaCadastro} />;

            case 'cadastro':
                return (
                    <Cadastro
                        onCadastrar={handleCadastrar}
                        onVoltar={handleVoltarParaLogin}
                    />
                );

            case 'splash':
                return <SplashScreen onFinish={handleSplashFinish} />;

            case 'selecaoBanco':
                return <SelecaoBanco onSelecionarBanco={handleSelecionarBanco} />;

            case 'lista':
                if (!tipoBanco) return null;
                return (
                    <ListaProdutos
                        tipoBanco={tipoBanco}
                        onAdicionar={handleAdicionar}
                        onEditar={handleEditar}
                        onVisualizar={handleVisualizar}
                        onLogoff={handleLogoff}
                        onAlterarBanco={handleAlterarBanco}
                        usuarioLogado={usuarioLogado}
                    />
                );

            case 'adicionar':
            case 'editar':
                if (!tipoBanco) return null;
                return (
                    <FormularioProduto
                        tipoBanco={tipoBanco}
                        db={db}
                        produto={telaAtual === 'editar' ? produtoSelecionado : null}
                        onSalvar={handleSalvar}
                        onCancelar={handleCancelar}
                    />
                );

            case 'visualizar':
                if (!produtoSelecionado) return null;
                return (
                    <VisualizarProduto
                        produto={produtoSelecionado}
                        onEditar={() => handleEditar(produtoSelecionado)}
                        onVoltar={handleVoltar}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {renderTela()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

