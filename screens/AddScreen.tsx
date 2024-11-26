import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../banco/firebaseConfig'; // Arquivo de configuração do Firebase
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddScreen: React.FC = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [area, setArea] = useState('');
  const [hostname, setHostname] = useState('');
  const [modelo, setModelo] = useState('');
  const [informacoes, setInformacoes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  // Função para capturar imagem da câmera
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Define o caminho da imagem capturada
    }
  };

  // Função para fazer upload da imagem para o Firebase Storage
  const uploadImageToStorage = async (uri: string) => {
    try {
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef); // Obtém a URL pública da imagem
      return downloadUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  // Função para salvar os dados no Firestore
  const handleSave = async () => {
    if (!nome || !area || !hostname || !modelo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      let imageUrl = null;
      if (photo) {
        imageUrl = await uploadImageToStorage(photo); // Faz o upload da imagem e obtém a URL
      }

      await addDoc(collection(db, 'equipamentos'), {
        nome,
        sobrenome,
        area,
        hostname,
        modelo,
        informacoes,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'Equipamento adicionado com sucesso!');
      navigation.goBack(); // Retorna à tela anterior
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Adicionar Equipamento</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
        <Text style={styles.text}>Área</Text>
        <Picker
          style={styles.picker}
          selectedValue={area}
          onValueChange={(value) => setArea(value)}
        >
          <Picker.Item label="Selecione uma área" value="" />
          <Picker.Item label="Produção" value="Produção" />
          <Picker.Item label="Qualidade" value="Qualidade" />
          <Picker.Item label="Logística" value="Logística" />
          <Picker.Item label="Recursos Humanos (RH)" value="Recursos Humanos (RH)" />
          <Picker.Item label="Administração" value="Administração" />
          <Picker.Item label="Manutenção" value="Manutenção" />
          <Picker.Item label="TI" value="TI" />
          <Picker.Item label="Comunicação" value="Comunicação" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Hostname"
          value={hostname}
          onChangeText={setHostname}
        />
        <Text style={styles.text}>Modelo</Text>
        <Picker
          style={styles.picker}
          selectedValue={modelo}
          onValueChange={(value) => setModelo(value)}
        >
          <Picker.Item label="Selecione um modelo" value="" />
          <Picker.Item label="Dell Latitude 3410" value="Dell Latitude 3410" />
          <Picker.Item label="Dell Latitude 3420" value="Dell Latitude 3420" />
          <Picker.Item label="Dell Latitude 3480" value="Dell Latitude 3480" />
          <Picker.Item label="Dell Latitude 5430" value="Dell Latitude 5430" />
          <Picker.Item label="Dell Precision 3660" value="Dell Precision 3660" />
          <Picker.Item label="Dell Precision 3581" value="Dell Precision 3581" />
          <Picker.Item label="Lenovo Thinkpad E14" value="Lenovo Thinkpad E14" />
        </Picker>

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Informações"
          value={informacoes}
          onChangeText={setInformacoes}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.evidenceButton}>
            <FontAwesome name="camera" size={32} color="black" />
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>
          {photo && <Image source={{ uri: photo }} style={styles.image} />}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <FontAwesome name="check" size={32} color="black" />
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2596be',
  },
  scrollContainer: {
    flexGrow: 1, // Garante que o conteúdo do ScrollView ocupe todo o espaço disponível
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 30,
    padding: 5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    color: "black",
    height: 50,
    width: '100%',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 1,
  },
  saveButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  evidenceButton: {
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default AddScreen;
