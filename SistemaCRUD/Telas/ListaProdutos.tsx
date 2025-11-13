import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {
    CriaBanco,
    CriaTabela,
    ListarProdutos as ListarSQLite,
    DeletarProduto as DeletarSQLite,
} from '../Conf/Bd';
import {
    ListarProdutos as ListarREST,
    DeletarProduto as DeletarREST,
} from '../Conf/RestApi';

interface Produto {
    id?: number | string;
    _id?: string;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
}

interface ListaProdutosProps {
    tipoBanco: 'sqlite' | 'rest';
    onAdicionar: () => void;
    onEditar: (produto: Produto) => void;
    onVisualizar: (produto: Produto) => void;
    onLogoff: () => void;
    usuarioLogado?: string | null;
}

export default function ListaProdutos({
    tipoBanco,
    onAdicionar,
    onEditar,
    onVisualizar,
    onLogoff,
    usuarioLogado,
}: ListaProdutosProps) {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        carregarProdutos();
    }, [tipoBanco]);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            if (tipoBanco === 'sqlite') {
                const database = await CriaBanco();
                if (database) {
                    await CriaTabela(database);
                    setDb(database);
                    const lista = await ListarSQLite(database);
                    setProdutos(lista as Produto[]);
                }
            } else {
                const lista = await ListarREST();
                setProdutos(lista);
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = (produto: Produto) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Deseja realmente excluir o produto "${produto.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (tipoBanco === 'sqlite' && db) {
                                const sucesso = await DeletarSQLite(db, produto.id as number);
                                if (sucesso) {
                                    carregarProdutos();
                                }
                            } else {
                                const id = produto._id || produto.id;
                                const sucesso = await DeletarREST(id as string);
                                if (sucesso) {
                                    carregarProdutos();
                                }
                            }
                        } catch (error) {
                            Alert.alert('Erro', 'Erro ao excluir produto');
                        }
                    },
                },
            ]
        );
    };

    const formatarPreco = (preco: number) => {
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando produtos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>Produtos</Text>
                    {usuarioLogado && (
                        <Text style={styles.usuarioText}>Olá, {usuarioLogado}</Text>
                    )}
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.addButton} onPress={onAdicionar}>
                        <Text style={styles.addButtonText}>+ Adicionar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoffButton} onPress={onLogoff}>
                        <Text style={styles.logoffButtonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {produtos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                    <TouchableOpacity style={styles.emptyButton} onPress={onAdicionar}>
                        <Text style={styles.emptyButtonText}>Adicionar Primeiro Produto</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
                    renderItem={({ item }) => (
                        <View style={styles.produtoCard}>
                            <View style={styles.produtoInfo}>
                                <Text style={styles.produtoNome}>{item.nome}</Text>
                                <Text style={styles.produtoPreco}>{formatarPreco(item.preco)}</Text>
                                <Text style={styles.produtoQuantidade}>
                                    Quantidade: {item.quantidade}
                                </Text>
                            </View>
                            <View style={styles.produtoActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.viewButton]}
                                    onPress={() => onVisualizar(item)}
                                >
                                    <Text style={styles.actionButtonText}>Ver</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => onEditar(item)}
                                >
                                    <Text style={styles.actionButtonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => handleDeletar(item)}
                                >
                                    <Text style={styles.actionButtonText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    usuarioText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoffButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
    },
    logoffButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    emptyButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    produtoCard: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    produtoInfo: {
        marginBottom: 10,
    },
    produtoNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    produtoPreco: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    produtoQuantidade: {
        fontSize: 14,
        color: '#666',
    },
    produtoActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
    },
    viewButton: {
        backgroundColor: '#34C759',
    },
    editButton: {
        backgroundColor: '#FF9500',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

