import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
        <Text style={styles.label}>Sobrenome:</Text>
        <Text style={styles.value}>{equipamento.sobrenome}</Text>
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
        <Text style={styles.value}>{equipamento.informacoes}</Text>
      </View>

      {/* Exibir a imagem, se existir */}
      {equipamento.photoUrl && (
        <Image source={{ uri: equipamento.photoUrl }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2596be',
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
    borderWidth: 1,
    borderColor: '#B0B0B0',
    padding: 10,
    marginVertical: 6,
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default DetalhesScreen;
