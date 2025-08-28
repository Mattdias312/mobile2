import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { TextInput, Divider, Text } from 'react-native-paper';
 
export default function App() {
  const [cep, setCep] = useState('');
  const [dadosCep, setDadosCep] = useState([]);
 
 
  // Função para formatar o CEP
  const buscaCep = (value) => {
     let url = `https://viacep.com.br/ws/${value}/json/`;
      fetch(url)
        .then( (response) =>{ return response.json()})
        .then((data) => {
                console.log(data)
                setDadosCep(data);
               
               })
        .catch((error) => {
           console.error('Erro ao buscar CEP:', error); });      
  }
 
  return (
    <View style={styles.container}>
       
      <Text>Digite o CEP:</Text>
      <TextInput
        style={{ height: 40,
           borderColor: 'gray',
           borderWidth: 1,
            width: 200,
             marginTop: 10 }}
             label={"CEP"}
        placeholder="Ex: 12345678"
        keyboardType="numeric"          
        onChangeText={(text) => {setCep(text)}}
        />
        <Pressable  onPress={() => buscaCep(cep)}>
             <Text
               style={{
                 backgroundColor: 'blue',
                  color: 'white',
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 5
                }}
               >
                Buscar CEP
              </Text>
        </Pressable>
 
      <Text style={{ marginTop: 20 }}>
        CEP: {cep}
      </Text>
     
        {
          dadosCep.lenght === 0 ?(
            <Text>Nenhum dado encontrado</Text>
          ) : (
            <View style={{marginTop: 20}}>
              <TextInput
              style={{ height: 40,
           borderColor: 'gray',
           borderWidth: 1,
            width: 200,
             marginTop: 10 }}
              label={"Rua"}
              value={dadosCep.logradouro}
              editable={false}
              />
              <Divider />
              <Text>CEP: {dadosCep.cep}</Text>
              
              <Divider />
              <Text>Logradouro: {dadosCep.logradouro}</Text>
              <Divider />
              <Text>Bairro: {dadosCep.bairro}</Text>
              <Divider />
              <Text>Cidade: {dadosCep.localidade}</Text>
              <Divider />
              <Text>Estado: {dadosCep.uf}</Text>
              <Divider />
            </View>
          )
        }
 
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});