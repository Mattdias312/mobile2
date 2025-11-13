import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Detalhes do Produto</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Nome</Text>
                    <Text style={styles.value}>{produto.nome}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Descrição</Text>
                    <Text style={styles.value}>
                        {produto.descricao || 'Sem descrição'}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Preço</Text>
                    <Text style={[styles.value, styles.preco]}>
                        {formatarPreco(produto.preco)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Quantidade</Text>
                    <Text style={styles.value}>{produto.quantidade} unidades</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Data de Criação</Text>
                    <Text style={styles.value}>
                        {formatarData(produto.data_criacao || produto.createdAt)}
                    </Text>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.button, styles.voltarButton]}
                        onPress={onVoltar}
                    >
                        <Text style={styles.buttonText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.editarButton]}
                        onPress={onEditar}
                    >
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    preco: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    voltarButton: {
        backgroundColor: '#8E8E93',
    },
    editarButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

