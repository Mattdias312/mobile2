import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../tema';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 5000); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient colors={['#1E1E2F', '#4B68FF']} style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.logo}>
                <Text style={styles.logoText}>SC</Text>
            </View>
            <Text style={styles.title}>Sistema CRUD</Text>
            <Text style={styles.subtitle}>Gerenciamento inteligente de produtos</Text>
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoText: {
        fontSize: 42,
        color: '#fff',
        fontWeight: '800',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 40,
    },
    loader: {
        marginTop: 20,
    },
});

