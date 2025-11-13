import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2000); // 2 segundos

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>Sistema CRUD</Text>
            <Text style={styles.subtitle}>Gerenciamento de Produtos</Text>
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
    },
    loader: {
        marginTop: 20,
    },
});

