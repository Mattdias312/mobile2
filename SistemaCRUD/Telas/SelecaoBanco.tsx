import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface SelecaoBancoProps {
    onSelecionarBanco: (tipo: 'sqlite' | 'rest') => void;
}

export default function SelecaoBanco({ onSelecionarBanco }: SelecaoBancoProps) {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>Escolha o Banco de Dados</Text>
            <Text style={styles.subtitle}>Selecione como deseja armazenar os dados</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => onSelecionarBanco('sqlite')}
            >
                <Text style={styles.buttonText}>SQLite</Text>
                <Text style={styles.buttonSubtext}>Banco local no dispositivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => onSelecionarBanco('rest')}
            >
                <Text style={styles.buttonText}>REST API (MongoDB)</Text>
                <Text style={styles.buttonSubtext}>Banco remoto via API</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonSecondary: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonSubtext: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9,
    },
});

