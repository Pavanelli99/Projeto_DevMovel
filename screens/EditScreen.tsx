import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../banco/firebaseConfig'; // Atualize o caminho conforme necessário
import { RootStackParamList, EditScreenNavigationProp, EditScreenRouteProp } from '../App'; // Atualize o caminho conforme necessário

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

  useEffect(() => {
    if (!equipamento) {
      Alert.alert('Erro', 'Equipamento não encontrado');
      navigation.goBack();
    }
  }, [equipamento, navigation]);

  const handleSave = async () => {
    if (!equipamento) return;
    try {
      const equipamentoRef = doc(db, 'equipamentos', equipamento.id);
      await updateDoc(equipamentoRef, {
        nome,
        sobrenome,
        area,
        hostname,
        modelo,
        informacoes
      });
      Alert.alert('Sucesso', 'Equipamento atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o equipamento');
    }
  };

  return (
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
      <View style={styles.buttonContainer}>
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
    borderColor: '#ccc',
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
    borderColor: 'gray',
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
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButton: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditScreen;
