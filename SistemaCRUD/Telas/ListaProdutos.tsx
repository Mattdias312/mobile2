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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
import { theme } from '../tema';

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
    onAlterarBanco: () => void;
    usuarioLogado?: string | null;
}

export default function ListaProdutos({
    tipoBanco,
    onAdicionar,
    onEditar,
    onVisualizar,
    onLogoff,
    onAlterarBanco,
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

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4B68FF', '#7C83FD']} style={styles.hero}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.heroTitle}>Seus produtos</Text>
                        <Text style={styles.heroSubtitle}>
                            {usuarioLogado ? `Bem-vindo, ${usuarioLogado}` : 'Mantenha tudo organizado'}
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.alterarBancoBadge} onPress={onAlterarBanco}>
                            <Ionicons name="swap-horizontal-outline" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoffBadge} onPress={onLogoff}>
                            <Ionicons name="log-out-outline" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.heroFooter}>
                    <Text style={styles.heroFooterText}>
                        {produtos.length} {produtos.length === 1 ? 'item' : 'itens'} cadastrados
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.listWrapper}>
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Carregando produtos...</Text>
                    </View>
                ) : produtos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={56} color={theme.colors.muted} />
                        <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={onAdicionar}>
                            <Text style={styles.emptyButtonText}>Adicionar primeiro produto</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={produtos}
                        contentContainerStyle={styles.listContent}
                        keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
                        renderItem={({ item }) => (
                            <View style={styles.produtoCard}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={styles.produtoNome}>{item.nome}</Text>
                                        <Text style={styles.produtoDescricao}>
                                            {item.descricao || 'Sem descrição'}
                                        </Text>
                                    </View>
                                    <View style={styles.badge}>
                                        <Ionicons name="pricetag-outline" size={14} color="#fff" />
                                        <Text style={styles.badgeText}>{formatarPreco(item.preco)}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.produtoQuantidade}>
                                        {item.quantidade} unidades
                                    </Text>
                                    <View style={styles.produtoActions}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.viewButton]}
                                            onPress={() => onVisualizar(item)}
                                        >
                                            <Ionicons name="eye-outline" size={18} color="#34C759" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.editButton]}
                                            onPress={() => onEditar(item)}
                                        >
                                            <Ionicons name="create-outline" size={18} color="#FF9500" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.deleteButton]}
                                            onPress={() => handleDeletar(item)}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.fab} onPress={onAdicionar}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    hero: {
        paddingTop: 60,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    alterarBancoBadge: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },
    logoffBadge: {
        width: 44,
        height: 44,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroFooter: {
        marginTop: theme.spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.15)',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    heroFooterText: {
        color: '#fff',
        fontWeight: '600',
    },
    listWrapper: {
        flex: 1,
        marginTop: -30,
        paddingHorizontal: theme.spacing.lg,
    },
    listContent: {
        paddingBottom: 120,
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
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadow.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    badgeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    produtoNome: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
    },
    produtoDescricao: {
        color: theme.colors.muted,
        marginTop: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    produtoQuantidade: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    produtoActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(103,80,164,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewButton: {
        backgroundColor: 'rgba(52,199,89,0.12)',
    },
    editButton: {
        backgroundColor: 'rgba(255,149,0,0.12)',
    },
    deleteButton: {
        backgroundColor: 'rgba(255,59,48,0.12)',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 36,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.card,
    },
});

