import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../banco/firebaseConfig'; // Atualize o caminho conforme necessário
import { EditScreenNavigationProp, EditScreenRouteProp } from '../App'; // Atualize o caminho conforme necessário

const EditScreen: React.FC = () => {
  const navigation = useNavigation<EditScreenNavigationProp>();
  const route = useRoute<EditScreenRouteProp>();
  const { equipamento } = route.params || {}; // Adicione um fallback para evitar undefined

  const [nome, setNome] = useState(equipamento?.nome || '');
  const [sobrenome, setSobrenome] = useState(equipamento?.sobrenome || '');
  const [area, setArea] = useState(equipamento?.area || '');
  const [hostname, setHostname] = useState(equipamento?.hostname || '');
  const [modelo, setModelo] = useState(equipamento?.modelo || '');
  const [informacoes, setInformacoes] = useState(equipamento?.informacoes || '');
  const [photo, setPhoto] = useState<string | null>(equipamento?.imageUrl || null);

  useEffect(() => {
    if (!equipamento) {
      Alert.alert('Erro', 'Equipamento não encontrado');
      navigation.goBack();
    }
  }, [equipamento, navigation]);

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
      setPhoto(result.assets[0].uri);
    }
  };

  // Função para fazer upload da imagem para o Firebase Storage
  const uploadImageToStorage = async (uri: string) => {
    try {
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!nome || !sobrenome || !area || !hostname || !modelo || !informacoes) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    if (!equipamento) return;

    try {
      let imageUrl = photo;
      if (photo && photo !== equipamento.imageUrl) {
        imageUrl = await uploadImageToStorage(photo);
      }

      const equipamentoRef = doc(db, 'equipamentos', equipamento.id);
      await updateDoc(equipamentoRef, {
        nome,
        sobrenome,
        area,
        hostname,
        modelo,
        informacoes,
        imageUrl,
      });

      Alert.alert('Sucesso', 'Equipamento atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o equipamento');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Editar Equipamento</Text>
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
        {photo && <Image source={{ uri: photo }} style={styles.image} />}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.photoButton}>
            <FontAwesome name="camera" size={32} color="black" />
            <Text style={styles.buttonText}>Trocar Foto</Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2596be',
    justifyContent: 'space-between', // Para distribuir os elementos corretamente
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
  image: {
    width: 100,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop:20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribui os botões ao longo do eixo horizontal
    marginTop: 20,
    marginBottom: 20,
  },
  photoButton: {
    flex: 1, // Ocupa a metade do espaço disponível
    alignItems: 'center', // Centraliza o conteúdo dentro do botão
    marginRight: 10, // Espaço entre os botões
    padding: 10,
    //backgroundColor: '#e0e0e0', // Exemplo de cor de fundo
    borderRadius: 10, // Bordas arredondadas
  },
  saveButton: {
    flex: 1, // Ocupa a outra metade do espaço disponível
    alignItems: 'center', // Centraliza o conteúdo dentro do botão
    marginLeft: 10, // Espaço entre os botões
    padding: 10,
    //backgroundColor: '#4caf50', // Exemplo de cor de fundo
    borderRadius: 10, // Bordas arredondadas
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    //color: '#fff', // Cor do texto, para contraste com o fundo
  },
});

export default EditScreen;
