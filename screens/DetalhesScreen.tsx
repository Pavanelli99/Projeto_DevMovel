import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Pacote de ícones

const DetalhesScreen: React.FC = () => {
  const route = useRoute();
  const { equipamento } = route.params;
  const navigation = useNavigation();

  const handleVoltar = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
        <Icon name="arrow-back" size={35} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Detalhes do Equipamento</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{equipamento.nome}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Área:</Text>
        <Text style={styles.value}>{equipamento.area}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Hostname:</Text>
        <Text style={styles.value}>{equipamento.hostname}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Modelo:</Text>
        <Text style={styles.value}>{equipamento.modelo}</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Informações:</Text>
        <Text style={styles.value}>{equipamento.info}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
    marginVertical: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    marginVertical: 70,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'justify-between',
    borderWidth: 1,  // Borda de 1px
    borderColor: '#B0B0B0',  // Cor da borda tipo Excel
    padding: 10,  // Espaçamento interno
    marginVertical: 6,  // Espaçamento entre os campos
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#555',
    marginLeft: 4,
  },
});

export default DetalhesScreen;
