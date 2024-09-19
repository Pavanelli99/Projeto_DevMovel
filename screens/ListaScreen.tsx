import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Adicionado deleteDoc e doc
import { db } from '../banco/firebaseConfig'; // Arquivo de configuração do Firebase

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'equipamentos', id));
      fetchEquipamentos(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir equipamento', error);
    }
  };

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
            onPress={() => navigation.navigate('EquipamentoDetalhes', { equipamento: item })}
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
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('Edit', { equipamento: item })}
                >
                  <MaterialIcons name="edit" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <MaterialIcons name="delete" size={32} color="white" />
                </TouchableOpacity>
              </View>
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
    //backgroundColor: '#fff',
    backgroundColor: '#2596be',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 7,
    textAlign: 'center',
    color: 'blue',
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
    fontSize: 16,
    color: 'black',
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
    backgroundColor: '#333',
    width: 35,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    width: 35,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    borderRadius: 5,
    marginVertical: 40,
    marginHorizontal: 10,
  },
});

export default ListaScreen;
