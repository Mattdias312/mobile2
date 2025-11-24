import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../tema';

interface SelecaoBancoProps {
    onSelecionarBanco: (tipo: 'sqlite' | 'rest') => void;
}

export default function SelecaoBanco({ onSelecionarBanco }: SelecaoBancoProps) {
    return (
        <LinearGradient colors={['#4B68FF', '#7C83FD']} style={styles.gradient}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Onde salvar seus dados?</Text>
                    <Text style={styles.subtitle}>
                        Escolha a experiência que melhor se adapta ao seu projeto
                    </Text>
                </View>

                <View style={styles.cards}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => onSelecionarBanco('sqlite')}
                    >
                        <View style={styles.iconBadge}>
                            <Ionicons name="phone-portrait-outline" size={28} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>SQLite</Text>
                        <Text style={styles.cardDescription}>
                            Banco local rápido, perfeito para funcionar offline.
                        </Text>
                        <Text style={styles.tag}>Recomendado para protótipos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, styles.cardAlt]}
                        onPress={() => onSelecionarBanco('rest')}
                    >
                        <View style={[styles.iconBadge, styles.iconBadgeAlt]}>
                            <Ionicons name="cloud-outline" size={28} color={theme.colors.secondary} />
                        </View>
                        <Text style={[styles.cardTitle, styles.cardTitleAlt]}>REST API (MongoDB)</Text>
                        <Text style={[styles.cardDescription, styles.cardDescriptionAlt]}>
                            Sincronize com a nuvem e compartilhe dados em vários dispositivos.
                        </Text>
                        <Text style={[styles.tag, styles.tagAlt]}>Ideal para equipes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
    },
    cards: {
        gap: theme.spacing.md,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        ...theme.shadow.card,
    },
    cardAlt: {
        backgroundColor: '#101C3D',
    },
    iconBadge: {
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#EEF1FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    iconBadgeAlt: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    cardDescription: {
        color: theme.colors.muted,
        fontSize: 14,
        lineHeight: 20,
    },
    cardDescriptionAlt: {
        color: 'rgba(255,255,255,0.85)',
    },
    cardTitleAlt: {
        color: '#fff',
    },
    tag: {
        alignSelf: 'flex-start',
        marginTop: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: 999,
        backgroundColor: '#EEF1FF',
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 12,
    },
    tagAlt: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        color: '#fff',
    },
    cardAltText: {
        color: '#fff',
    },
});

