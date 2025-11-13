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
import * as SQLite from 'expo-sqlite';
import {
    InserirProduto as InserirSQLite,
    AtualizarProduto as AtualizarSQLite,
} from '../Conf/Bd';
import {
    InserirProduto as InserirREST,
    AtualizarProduto as AtualizarREST,
} from '../Conf/RestApi';

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
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>
                    {isEditando ? 'Editar Produto' : 'Novo Produto'}
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome *</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome do produto"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Digite a descrição do produto"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preço *</Text>
                    <TextInput
                        style={styles.input}
                        value={preco}
                        onChangeText={setPreco}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantidade *</Text>
                    <TextInput
                        style={styles.input}
                        value={quantidade}
                        onChangeText={setQuantidade}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onCancelar}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSalvar}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Salvar</Text>
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
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
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
    cancelButton: {
        backgroundColor: '#8E8E93',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

