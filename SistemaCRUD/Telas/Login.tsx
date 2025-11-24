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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { CriaBanco, CriaTabela, VerificarLogin } from '../Conf/Bd';
import { VerificarLogin as VerificarLoginREST } from '../Conf/RestApi';
import { theme } from '../tema';

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
        <LinearGradient
            colors={[theme.colors.primary, '#7F63F4', '#4ECDC4']}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <StatusBar style="light" />
                <View style={styles.content}>
                    <View style={styles.hero}>
                        <View style={styles.heroBadge}>
                            <Ionicons name="shield-checkmark" color={theme.colors.primary} size={18} />
                            <Text style={styles.heroBadgeText}>Seguro e moderno</Text>
                        </View>
                        <Text style={styles.title}>Sistema CRUD</Text>
                        <Text style={styles.subtitle}>Gerencie seus produtos em minutos</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.formTitle}>Faça login</Text>
                        <Text style={styles.formSubtitle}>
                            Acesse seu painel personalizado
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Usuário</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={theme.colors.muted}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={usuario}
                                    onChangeText={setUsuario}
                                    placeholder="Digite seu usuário"
                                    placeholderTextColor={theme.colors.muted}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={theme.colors.muted}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={senha}
                                    onChangeText={setSenha}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor={theme.colors.muted}
                                    secureTextEntry={!mostrarSenha}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                                    <Ionicons
                                        name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={theme.colors.primary}
                                    />
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
                                Não tem uma conta? <Text style={styles.link}>Criar conta</Text>
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>Usuários de teste</Text>
                            <View style={styles.chips}>
                                {['admin / admin123', 'user / user123', 'teste / teste123'].map(
                                    (credencial) => (
                                        <View key={credencial} style={styles.chip}>
                                            <Ionicons
                                                name="checkmark-circle-outline"
                                                size={16}
                                                color={theme.colors.secondary}
                                            />
                                            <Text style={styles.chipText}>{credencial}</Text>
                                        </View>
                                    )
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    hero: {
        marginBottom: theme.spacing.lg,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        marginBottom: theme.spacing.sm,
    },
    heroBadgeText: {
        marginLeft: 6,
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        marginTop: theme.spacing.xs,
    },
    form: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        ...theme.shadow.card,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
    },
    formSubtitle: {
        color: theme.colors.muted,
        fontSize: 14,
        marginTop: -8,
    },
    inputGroup: {
        gap: theme.spacing.xs,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
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
        fontSize: 16,
        paddingVertical: theme.spacing.sm,
        color: theme.colors.text,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cadastrarButton: {
        alignItems: 'center',
    },
    cadastrarButtonText: {
        color: theme.colors.muted,
    },
    link: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    infoContainer: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: '#F7F9FD',
        borderRadius: theme.radius.md,
    },
    infoTitle: {
        color: theme.colors.text,
        fontWeight: '700',
        marginBottom: theme.spacing.sm,
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    chipText: {
        marginLeft: 6,
        color: theme.colors.text,
        fontSize: 12,
    },
});

