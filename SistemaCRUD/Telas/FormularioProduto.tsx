import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import {
    InserirProduto as InserirSQLite,
    AtualizarProduto as AtualizarSQLite,
} from '../Conf/Bd';
import {
    InserirProduto as InserirREST,
    AtualizarProduto as AtualizarREST,
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

interface FormularioProdutoProps {
    tipoBanco: 'sqlite' | 'rest';
    db: SQLite.SQLiteDatabase | null;
    produto?: Produto | null;
    onSalvar: () => void;
    onCancelar: () => void;
}

export default function FormularioProduto({
    tipoBanco,
    db,
    produto,
    onSalvar,
    onCancelar,
}: FormularioProdutoProps) {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditando, setIsEditando] = useState(false);

    useEffect(() => {
        if (produto) {
            setIsEditando(true);
            setNome(produto.nome);
            setDescricao(produto.descricao || '');
            setPreco(produto.preco.toString());
            setQuantidade(produto.quantidade.toString());
        } else {
            setIsEditando(false);
            limparFormulario();
        }
    }, [produto]);

    const limparFormulario = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setQuantidade('');
    };

    const validarFormulario = () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O nome é obrigatório');
            return false;
        }
        if (!preco.trim() || parseFloat(preco) <= 0) {
            Alert.alert('Erro', 'O preço deve ser maior que zero');
            return false;
        }
        if (!quantidade.trim() || parseInt(quantidade) < 0) {
            Alert.alert('Erro', 'A quantidade deve ser maior ou igual a zero');
            return false;
        }
        return true;
    };

    const handleSalvar = async () => {
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        try {
            const precoNum = parseFloat(preco);
            const quantidadeNum = parseInt(quantidade);

            if (isEditando && produto) {
                // Atualizar
                if (tipoBanco === 'sqlite' && db) {
                    const sucesso = await AtualizarSQLite(
                        db,
                        produto.id as number,
                        nome,
                        descricao,
                        precoNum,
                        quantidadeNum
                    );
                    if (sucesso) {
                        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
                        onSalvar();
                    } else {
                        Alert.alert('Erro', 'Erro ao atualizar produto');
                    }
                } else {
                    const id = produto._id || produto.id;
                    const sucesso = await AtualizarREST(
                        id as string,
                        nome,
                        descricao,
                        precoNum,
                        quantidadeNum
                    );
                    if (sucesso) {
                        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
                        onSalvar();
                    } else {
                        Alert.alert('Erro', 'Erro ao atualizar produto');
                    }
                }
            } else {
                // Inserir
                if (tipoBanco === 'sqlite' && db) {
                    const sucesso = await InserirSQLite(
                        db,
                        nome,
                        descricao,
                        precoNum,
                        quantidadeNum
                    );
                    if (sucesso) {
                        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
                        limparFormulario();
                        onSalvar();
                    } else {
                        Alert.alert('Erro', 'Erro ao cadastrar produto');
                    }
                } else {
                    const sucesso = await InserirREST(
                        nome,
                        descricao,
                        precoNum,
                        quantidadeNum
                    );
                    if (sucesso) {
                        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
                        limparFormulario();
                        onSalvar();
                    } else {
                        Alert.alert('Erro', 'Erro ao cadastrar produto');
                    }
                }
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
            <View style={styles.form}>
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.title}>
                            {isEditando ? 'Editar produto' : 'Novo produto'}
                        </Text>
                        <Text style={styles.subtitle}>
                            Complete os campos com as informações essenciais
                        </Text>
                    </View>
                    <Ionicons
                        name={isEditando ? 'create-outline' : 'cube-outline'}
                        size={28}
                        color={theme.colors.primary}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações básicas</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome *</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="text-outline" size={18} color={theme.colors.muted} />
                            <TextInput
                                style={styles.input}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Digite o nome do produto"
                                placeholderTextColor={theme.colors.muted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descrição</Text>
                        <View style={[styles.inputWrapper, styles.textArea]}>
                            <TextInput
                                style={[styles.input, styles.inputMultiline]}
                                value={descricao}
                                onChangeText={setDescricao}
                                placeholder="Conte um pouco sobre o produto"
                                placeholderTextColor={theme.colors.muted}
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estoque e preço</Text>
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.flex]}>
                            <Text style={styles.label}>Preço *</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="cash-outline" size={18} color={theme.colors.muted} />
                                <TextInput
                                    style={styles.input}
                                    value={preco}
                                    onChangeText={setPreco}
                                    placeholder="0.00"
                                    placeholderTextColor={theme.colors.muted}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, styles.flex]}>
                            <Text style={styles.label}>Quantidade *</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="layers-outline" size={18} color={theme.colors.muted} />
                                <TextInput
                                    style={styles.input}
                                    value={quantidade}
                                    onChangeText={setQuantidade}
                                    placeholder="0"
                                    placeholderTextColor={theme.colors.muted}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancelar}
                        disabled={loading}
                    >
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSalvar}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={styles.saveContent}>
                                <Ionicons name="save-outline" size={18} color="#fff" />
                                <Text style={styles.buttonText}>Salvar</Text>
                            </View>
                        )}
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
        paddingBottom: 120,
    },
    form: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        ...theme.shadow.card,
        gap: theme.spacing.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        color: theme.colors.muted,
        marginTop: 6,
    },
    section: {
        gap: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    inputGroup: {
        gap: theme.spacing.xs,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    flex: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: '#F9FAFF',
        gap: theme.spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.text,
    },
    inputMultiline: {
        height: 100,
        textAlignVertical: 'top',
    },
    textArea: {
        alignItems: 'flex-start',
        paddingTop: theme.spacing.sm,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    button: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    saveContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelText: {
        color: theme.colors.text,
        fontWeight: '600',
    },
});

