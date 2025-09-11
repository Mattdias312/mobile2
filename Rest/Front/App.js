import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function App() {
  // ip // atlas
  //const url ='http://localhost:3000'; 
  const url = 'http://192.168.50.81:3000';
  //const url ='http://10.0.2.2:3000'; 

  

  // exebir o dados na tela
  const ExibirDados = (urlX) => {
    fetch(urlX)
      .then((response) => { return response.json()})
      .then((data) => {
        console.log(data);
      })
  }

  //inserir dados
  const inserirUser = (urlX) => {
    fetch(urlX+'/inserir',{
      method: 'POST',
      body: JSON.stringify({
        nome: 'Vitor'
    }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => { return response.json()})
    .then((data) => {
      console.log(data);
    })
  }

  //deletar por id
  const deletarId = (urlX) => {
    fetch(urlX+'/deletar/68c20ae0c3c11adbdb24df5b',{
      method: 'DELETE'
    })
    .then((resp) =>  resp.json())
    .then((data) => console.log(data));
  }

  //update por id
  const updateId = (urlX) => {
    fetch(urlX+'/alterar/68c20751c3c11adbdb24df21',{
      method: 'PUT',
      body: JSON.stringify({
        nome: 'TESTE'
    }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => { return response.json()})
    .then((data) => {
      console.log(data);
    })
  }

  return (
    <View style={styles.container}>
    
      <Button
      title='EXIBIR DADOS'
      onPress={() => ExibirDados(url)}
      />
      
      <Button
      title='INSERIR DADOS'
      onPress={() => inserirUser(url)}
      />

      <Button
      title='DELETAR ID'
      onPress={() => deletarId(url)}
      />

      <Button
      title='UPDATE ID'
      onPress={() => updateId(url)}
      />

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
