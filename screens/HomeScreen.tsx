import React, { useState } from 'react';
import { View, Text, TextInput, Button, ImageBackground, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    } else {
      // Simulação de login bem-sucedido
      Alert.alert('Sucesso', `Bem-vindo, ${username}!`);
      // Navegar para a tela de detalhes após login bem-sucedido
      navigation.navigate('Lista', { itemId: 42 });
    }
  };

  return (
    <ImageBackground
      source={require('../images/login.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Equipamento</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Acessar" onPress={handleLogin} color="#d9534f" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center', // Garantir que o conteúdo esteja centralizado
    width: '90%', // Ajuste a largura do contêiner conforme necessário
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 150, // Ajuste conforme necessário
    textAlign: 'center',
    color: 'red',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
  },
});

export default HomeScreen;
