import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../tema';

interface Produto {
    id?: number | string;
    _id?: string;
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    data_criacao?: string;
    createdAt?: string;
}

interface VisualizarProdutoProps {
    produto: Produto;
    onEditar: () => void;
    onVoltar: () => void;
}

export default function VisualizarProduto({
    produto,
    onEditar,
    onVoltar,
}: VisualizarProdutoProps) {
    const formatarPreco = (preco: number) => {
        return `R$ ${preco.toFixed(2).replace('.', ',')}`;
    };

    const formatarData = (data?: string) => {
        if (!data) return 'Não informado';
        try {
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return data;
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{produto.nome}</Text>
                        <Text style={styles.subtitle}>
                            Atualizado em {formatarData(produto.data_criacao || produto.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.pricePill}>
                        <Ionicons name="cash-outline" size={18} color="#fff" />
                        <Text style={styles.priceText}>{formatarPreco(produto.preco)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.value}>
                        {produto.descricao || 'Sem descrição cadastrada.'}
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="layers-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.statLabel}>Quantidade</Text>
                        <Text style={styles.statValue}>{produto.quantidade}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
                        <Text style={styles.statLabel}>Criado em</Text>
                        <Text style={styles.statValue}>
                            {formatarData(produto.data_criacao || produto.createdAt)}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onVoltar}>
                        <Ionicons name="arrow-back-outline" size={18} color={theme.colors.primary} />
                        <Text style={styles.secondaryText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.primary]} onPress={onEditar}>
                        <Ionicons name="create-outline" size={18} color="#fff" />
                        <Text style={styles.primaryText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        ...theme.shadow.card,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        color: theme.colors.muted,
        marginTop: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    pricePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: 999,
        gap: 6,
    },
    priceText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: 14,
        color: theme.colors.muted,
        marginBottom: 6,
    },
    value: {
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    statCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        gap: 4,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.lg,
    },
    button: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    secondary: {
        backgroundColor: 'rgba(103,80,164,0.08)',
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondaryText: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    primaryText: {
        color: '#fff',
        fontWeight: '700',
    },
});

