import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CriaBanco, CriaTabela, InserirUsuario, ListarUsuario } from './Conf/Bd';
import { useEffect } from 'react';

export default function App() {
async function Main() {
  const db = await CriaBanco();
  if (db) {
    await CriaTabela(db);
    // await InserirUsuario(db, 'João', 'joao@gmail.com');
    const usuarios = await ListarUsuario(db);
    for (const usuario of usuarios) {
      console.log('Usuario', usuario);
    }
  }
}

  useEffect(() => {
    Main();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
