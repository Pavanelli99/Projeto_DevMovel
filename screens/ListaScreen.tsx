import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../banco/firebaseConfig'; // Arquivo de configuração do Firebase
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

const ListaScreen: React.FC = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const navigation = useNavigation();

  const fetchEquipamentos = async () => {
    try {
      const equipamentosCollection = collection(db, 'equipamentos');
      const querySnapshot = await getDocs(equipamentosCollection);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipamentos(data);
    } catch (error) {
      console.error('Erro ao buscar equipamentos', error);
    }
  };

  // Atualiza a lista quando a tela ganhar o foco
  useFocusEffect(
    useCallback(() => {
      fetchEquipamentos();
    }, [])
  );

  const handleLogout = () => {
    // Navega para a tela de Login
    navigation.navigate('Home');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <FontAwesome name="star-o" size={24} color="black" style={styles.icon} />
        <View>
          <Text style={styles.setor}>{item.area}</Text>
          <Text style={styles.equipamento}>{item.nome}</Text>
        </View>
      </View>
      <FontAwesome name="sort-alpha-asc" size={24} color="black" style={styles.icon} />
    </View>
  );

  

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <FontAwesome name="sign-out" size={36} color="black" />
            
          </TouchableOpacity>
          <Text style={styles.headerText}>Lista de Equipamentos</Text>
        </View>

        <FlatList
        data={equipamentos}
        renderItem={({ item }) => (
          <TouchableOpacity
        
        >
        
          
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <FontAwesome name="laptop" size={24} color="black" style={styles.icon} />
              <View>
                <Text style={styles.setor}>{item.area}</Text>
                <Text style={styles.equipamento}>{item.nome} | {item.hostname}</Text>
                <Text style={styles.modelo}>{item.modelo}</Text> 

              </View>
            </View>
            
            <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit', { equipamento: item })}
      >
        <MaterialIcons name="edit" size={32} color="white" />
      </TouchableOpacity>
          </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Add')}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 7,
    //marginVertical: 1,
    textAlign: 'center',
    color: 'red',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    padding: 10,
    color: 'black',
  },
  setor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  equipamento: {
    fontSize: 14,
    color: '#666',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#333',
    width: 35,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  logoutButton: {
    borderRadius: 5,
    marginVertical: 40,
    marginHorizontal: 10,

  },

});

export default ListaScreen;
