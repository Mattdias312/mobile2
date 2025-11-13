import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { CriaBanco, CriaTabela, InserirUsuario, BuscarUsuarioPorNome, BuscarUsuarioPorEmail } from '../Conf/Bd';
import { InserirUsuario as InserirUsuarioREST, BuscarUsuarioPorNome as BuscarUsuarioPorNomeREST, BuscarUsuarioPorEmail as BuscarUsuarioPorEmailREST } from '../Conf/RestApi';

interface CadastroProps {
    onCadastrar: (usuario: string, senha: string) => void;
    onVoltar: () => void;
    tipoBanco?: 'sqlite' | 'rest';
}

export default function Cadastro({ onCadastrar, onVoltar, tipoBanco = 'sqlite' }: CadastroProps) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        if (tipoBanco === 'sqlite') {
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

    const validarEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleCadastrar = async () => {
        // Validações
        if (!usuario.trim()) {
            Alert.alert('Erro', 'Por favor, digite o usuário');
            return;
        }

        if (usuario.trim().length < 3) {
            Alert.alert('Erro', 'O usuário deve ter pelo menos 3 caracteres');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Erro', 'Por favor, digite o e-mail');
            return;
        }

        if (!validarEmail(email.trim())) {
            Alert.alert('Erro', 'Por favor, digite um e-mail válido');
            return;
        }

        if (!senha.trim()) {
            Alert.alert('Erro', 'Por favor, digite a senha');
            return;
        }

        if (senha.trim().length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        setLoading(true);

        try {
            // Verificar se usuário já existe
            let usuarioExistente = null;
            let emailExistente = null;

            if (tipoBanco === 'sqlite' && db) {
                usuarioExistente = await BuscarUsuarioPorNome(db, usuario.trim());
                emailExistente = await BuscarUsuarioPorEmail(db, email.trim());
            } else {
                usuarioExistente = await BuscarUsuarioPorNomeREST(usuario.trim());
                emailExistente = await BuscarUsuarioPorEmailREST(email.trim());
            }

            if (usuarioExistente) {
                Alert.alert('Erro', 'Usuário já existe');
                setLoading(false);
                return;
            }

            if (emailExistente) {
                Alert.alert('Erro', 'E-mail já cadastrado');
                setLoading(false);
                return;
            }

            // Inserir usuário
            let sucesso = false;
            if (tipoBanco === 'sqlite' && db) {
                sucesso = await InserirUsuario(db, usuario.trim(), email.trim(), senha.trim());
            } else {
                sucesso = await InserirUsuarioREST(usuario.trim(), email.trim(), senha.trim());
            }

            if (sucesso) {
                Alert.alert(
                    'Sucesso',
                    'Cadastro realizado com sucesso!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                onCadastrar(usuario.trim(), senha.trim());
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Erro', 'Erro ao cadastrar usuário');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao realizar cadastro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="auto" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Cadastre-se para começar</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Usuário *</Text>
                            <TextInput
                                style={styles.input}
                                value={usuario}
                                onChangeText={setUsuario}
                                placeholder="Digite seu usuário"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                            <Text style={styles.hint}>Mínimo de 3 caracteres</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail *</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Digite seu e-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha *</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={senha}
                                    onChangeText={setSenha}
                                    placeholder="Digite sua senha"
                                    secureTextEntry={!mostrarSenha}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    <Text style={styles.eyeButtonText}>
                                        {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.hint}>Mínimo de 6 caracteres</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirmar Senha *</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={confirmarSenha}
                                    onChangeText={setConfirmarSenha}
                                    placeholder="Confirme sua senha"
                                    secureTextEntry={!mostrarConfirmarSenha}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                >
                                    <Text style={styles.eyeButtonText}>
                                        {mostrarConfirmarSenha ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.cadastrarButton, loading && styles.cadastrarButtonDisabled]}
                            onPress={handleCadastrar}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.voltarButton}
                            onPress={onVoltar}
                            disabled={loading}
                        >
                            <Text style={styles.voltarButtonText}>
                                Já tem uma conta? Fazer login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    eyeButton: {
        padding: 12,
    },
    eyeButtonText: {
        fontSize: 20,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    cadastrarButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    cadastrarButtonDisabled: {
        opacity: 0.6,
    },
    cadastrarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    voltarButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    voltarButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
});

