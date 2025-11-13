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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { CriaBanco, CriaTabela, VerificarLogin } from '../Conf/Bd';
import { VerificarLogin as VerificarLoginREST } from '../Conf/RestApi';

interface LoginProps {
    onLogin: (usuario: string) => void;
    onIrParaCadastro: () => void;
    tipoBanco?: 'sqlite' | 'rest';
}

export default function Login({ onLogin, onIrParaCadastro, tipoBanco = 'sqlite' }: LoginProps) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
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

    const handleLogin = async () => {
        if (!usuario.trim()) {
            Alert.alert('Erro', 'Por favor, digite o usuário');
            return;
        }

        if (!senha.trim()) {
            Alert.alert('Erro', 'Por favor, digite a senha');
            return;
        }

        setLoading(true);

        try {
            let usuarioEncontrado = null;

            if (tipoBanco === 'sqlite' && db) {
                usuarioEncontrado = await VerificarLogin(db, usuario.trim(), senha.trim());
            } else {
                usuarioEncontrado = await VerificarLoginREST(usuario.trim(), senha.trim());
            }

            if (usuarioEncontrado) {
                Alert.alert('Sucesso', `Bem-vindo, ${usuario}!`);
                onLogin(usuario);
            } else {
                Alert.alert('Erro', 'Usuário ou senha incorretos');
                setSenha('');
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao fazer login');
            setSenha('');
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
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sistema CRUD</Text>
                    <Text style={styles.subtitle}>Gerenciamento de Produtos</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Usuário</Text>
                        <TextInput
                            style={styles.input}
                            value={usuario}
                            onChangeText={setUsuario}
                            placeholder="Digite seu usuário"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
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
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cadastrarButton}
                        onPress={onIrParaCadastro}
                        disabled={loading}
                    >
                        <Text style={styles.cadastrarButtonText}>
                            Não tem uma conta? Criar conta
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Usuários de teste:</Text>
                        <Text style={styles.infoText}>admin / admin123</Text>
                        <Text style={styles.infoText}>user / user123</Text>
                        <Text style={styles.infoText}>teste / teste123</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
    loginButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cadastrarButton: {
        marginTop: 15,
        padding: 10,
        alignItems: 'center',
    },
    cadastrarButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    infoContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
});

