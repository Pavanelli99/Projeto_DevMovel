import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../banco/firebaseConfig'; // Arquivo de configuração do Firebase
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage

const AddScreen: React.FC = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [area, setArea] = useState('');
  const [hostname, setHostname] = useState('');
  const [modelo, setModelo] = useState('');
  const [informacoes, setInformacoes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null); // Para armazenar a URL da imagem

  const handleSave = async () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !sobrenome || !area || !hostname || !modelo || !informacoes) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    try {
      // Salva os dados no Firestore
      await addDoc(collection(db, 'equipamentos'), {
        nome,
        sobrenome,
        area,
        hostname,
        modelo,
        informacoes,
        photoUrl, // Salva a URL da imagem no Firestore
      });
      Alert.alert('Sucesso', 'Equipamento salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o equipamento');
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    try {
      console.log('Iniciando o upload da imagem...');
      const storage = getStorage();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
  
      // Obtenha a imagem como um blob
      console.log('Buscando a imagem...');
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Falha ao buscar a imagem');
      }
      const blob = await response.blob();
      console.log(`Blob criado: tamanho=${blob.size}, tipo=${blob.type}`);
  
      // Faça upload da imagem
      console.log('Fazendo upload da imagem...');
      await uploadBytes(imageRef, blob);
      console.log('Imagem upload concluído');
  
      // Obtém a URL de download da imagem
      const downloadUrl = await getDownloadURL(imageRef);
      console.log(`URL de download obtida: ${downloadUrl}`);
      setPhotoUrl(downloadUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      Alert.alert('Erro', 'Não foi possível fazer o upload da imagem');
    }
  };
  
  
  

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar a câmera');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
  
      if (!result.cancelled) {
        setPhoto(result.uri);
        await uploadImageToStorage(result.uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };
  
  return (
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
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={area}
          onValueChange={(itemValue) => setArea(itemValue)}
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
      </View>
      <TextInput
        style={styles.input}
        placeholder="Hostname"
        value={hostname}
        onChangeText={setHostname}
      />
      <Text style={styles.text}>Modelo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={modelo}
          onValueChange={(itemValue) => setModelo(itemValue)}
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
      </View>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Informações"
        value={informacoes}
        onChangeText={setInformacoes}
        multiline
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.evidenceButton}>
          <FontAwesome name="camera" size={32} color="black" />
          <Text style={styles.buttonText}>Evidência</Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.image} />}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <FontAwesome name="check" size={32} color="black" />
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2596be',
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
    borderRadius: 10,
  },
});

export default AddScreen;
