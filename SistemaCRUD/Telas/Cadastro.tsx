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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { CriaBanco, CriaTabela, InserirUsuario, BuscarUsuarioPorNome, BuscarUsuarioPorEmail } from '../Conf/Bd';
import { InserirUsuario as InserirUsuarioREST, BuscarUsuarioPorNome as BuscarUsuarioPorNomeREST, BuscarUsuarioPorEmail as BuscarUsuarioPorEmailREST } from '../Conf/RestApi';
import { theme } from '../tema';

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
        <LinearGradient colors={['#f8f5ff', '#f2fbff']} style={styles.gradient}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <StatusBar style="dark" />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Criar Conta</Text>
                            <Text style={styles.subtitle}>Comece a controlar seus produtos</Text>
                            <View style={styles.progress}>
                                <View style={styles.progressStep}>
                                    <Ionicons name="person-add" size={18} color="#fff" />
                                </View>
                                <View style={styles.progressLine} />
                                <View style={[styles.progressStep, styles.progressStepMuted]}>
                                    <Ionicons name="lock-closed" size={18} color={theme.colors.muted} />
                                </View>
                                <View style={styles.progressLine} />
                                <View style={[styles.progressStep, styles.progressStepMuted]}>
                                    <Ionicons name="checkmark" size={18} color={theme.colors.muted} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Usuário *</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color={theme.colors.muted} />
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
                                <Text style={styles.hint}>Mínimo de 3 caracteres</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>E-mail *</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail-outline" size={20} color={theme.colors.muted} />
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="nome@empresa.com"
                                        placeholderTextColor={theme.colors.muted}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        editable={!loading}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, styles.flex]}>
                                    <Text style={styles.label}>Senha *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.muted} />
                                        <TextInput
                                            style={styles.input}
                                            value={senha}
                                            onChangeText={setSenha}
                                            placeholder="Digite sua senha"
                                            placeholderTextColor={theme.colors.muted}
                                            secureTextEntry={!mostrarSenha}
                                            autoCapitalize="none"
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
                                    <Text style={styles.hint}>Mínimo de 6 caracteres</Text>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirmar Senha *</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.muted} />
                                    <TextInput
                                        style={styles.input}
                                        value={confirmarSenha}
                                        onChangeText={setConfirmarSenha}
                                        placeholder="Repita sua senha"
                                        placeholderTextColor={theme.colors.muted}
                                        secureTextEntry={!mostrarConfirmarSenha}
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    >
                                        <Ionicons
                                            name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color={theme.colors.primary}
                                        />
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
                                    <Text style={styles.cadastrarButtonText}>Criar conta</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.voltarButton}
                                onPress={onVoltar}
                                disabled={loading}
                            >
                                <Text style={styles.voltarButtonText}>
                                    Já tem uma conta? <Text style={styles.voltarButtonHighlight}>Fazer login</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.muted,
        marginTop: 6,
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    progressStep: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressStepMuted: {
        backgroundColor: '#E7E7FB',
    },
    progressLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#E4E6F6',
    },
    form: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        ...theme.shadow.card,
        gap: theme.spacing.md,
    },
    inputGroup: {
        gap: theme.spacing.xs,
    },
    inputRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    flex: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
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
    hint: {
        fontSize: 12,
        color: theme.colors.muted,
    },
    cadastrarButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        alignItems: 'center',
    },
    cadastrarButtonDisabled: {
        opacity: 0.7,
    },
    cadastrarButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    voltarButton: {
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    voltarButtonText: {
        color: theme.colors.muted,
    },
    voltarButtonHighlight: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
});

