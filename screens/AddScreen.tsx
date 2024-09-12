import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../banco/firebaseConfig'; // Arquivo de configuração do Firebase

const AddScreen: React.FC = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [area, setArea] = useState('');
  const [hostname, setHostname] = useState('');
  const [modelo, setModelo] = useState('');
  const [informacoes, setInformacoes] = useState('');

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "equipamentos"), {
        nome,
        sobrenome,
        area,
        hostname,
        modelo,
        informacoes
      });
      Alert.alert('Sucesso', 'Equipamento salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o equipamento');
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
      <TouchableOpacity onPress={handleSave} style={styles.evidenceButton}>
          <FontAwesome name="camera" size={32} color="black" />
          <Text style={styles.buttonText}>Evidência</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 15,
    padding: 5,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 1, // Reduza o espaçamento entre o campo e os botões
  },
  evidenceButton: {
    alignItems: 'center',
    marginRight: 10, // Adicione uma margem para aproximar os botões
  },
  saveButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    color:"black",
    height: 50,
    width: '100%',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    marginBottom: 10,
    alignContent: "flex-start",
    fontSize: 14,
    fontWeight: "bold"

  },
});

export default AddScreen;
