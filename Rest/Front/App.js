import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';


export default function App() {
  // ip // atlas
  const url ='http://localhost:3000'; 
  // const url = 'http://192.168.50.81:3000';
  //const url ='http://10.0.2.2:3000'; 

  

  // exibir os dados na tela
  const ExibirDados = (urlX) => {
    fetch(urlX + '/api/alunos')
      .then((response) => { return response.json()})
      .then((data) => {
        console.log('Lista de Alunos:', data);
      })
      .catch((error) => {
        console.error('Erro ao buscar alunos:', error);
      })
  }

  //inserir dados
  const inserirUser = (urlX) => {
    const novoAluno = {
      matricula: '2024001',
      nome: 'Vitor Silva',
      endereco: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        complemento: 'Apto 101',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      cursos: ['Engenharia de Software', 'Banco de Dados']
    };

    fetch(urlX + '/api/alunos', {
      method: 'POST',
      body: JSON.stringify(novoAluno),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => { return response.json()})
    .then((data) => {
      console.log('Aluno inserido:', data);
    })
    .catch((error) => {
      console.error('Erro ao inserir aluno:', error);
    })
  }

  //deletar por id
  const deletarId = (urlX) => {
    // Primeiro vamos buscar um aluno para pegar o ID
    fetch(urlX + '/api/alunos')
      .then((response) => response.json())
      .then((alunos) => {
        if (alunos.length > 0) {
          const idParaDeletar = alunos[0]._id;
          console.log('Deletando aluno com ID:', idParaDeletar);
          
          return fetch(urlX + '/api/alunos/' + idParaDeletar, {
            method: 'DELETE'
          });
        } else {
          console.log('Nenhum aluno encontrado para deletar');
          return Promise.resolve({ json: () => ({ message: 'Nenhum aluno encontrado' }) });
        }
      })
      .then((resp) => resp.json())
      .then((data) => console.log('Resultado da exclusão:', data))
      .catch((error) => console.error('Erro ao deletar:', error));
  }

  //update por id
  const updateId = (urlX) => {
    // Primeiro vamos buscar um aluno para pegar o ID
    fetch(urlX + '/api/alunos')
      .then((response) => response.json())
      .then((alunos) => {
        if (alunos.length > 0) {
          const idParaAtualizar = alunos[0]._id;
          console.log('Atualizando aluno com ID:', idParaAtualizar);
          
          const dadosAtualizados = {
            matricula: alunos[0].matricula,
            nome: 'TESTE ATUALIZADO',
            endereco: alunos[0].endereco,
            cursos: [...(alunos[0].cursos || []), 'Curso Adicionado via App']
          };
          
          return fetch(urlX + '/api/alunos/' + idParaAtualizar, {
            method: 'PUT',
            body: JSON.stringify(dadosAtualizados),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        } else {
          console.log('Nenhum aluno encontrado para atualizar');
          return Promise.resolve({ json: () => ({ message: 'Nenhum aluno encontrado' }) });
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Resultado da atualização:', data);
      })
      .catch((error) => {
        console.error('Erro ao atualizar:', error);
      });
  }

  //testar busca de CEP
  const testarCEP = (urlX) => {
    fetch(urlX + '/api/cep/01310100')
      .then((response) => response.json())
      .then((data) => {
        console.log('Dados do CEP 01310-100:', data);
      })
      .catch((error) => {
        console.error('Erro ao buscar CEP:', error);
      });
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

      <Button
      title='TESTAR CEP'
      onPress={() => testarCEP(url)}
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
