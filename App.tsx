// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ListaScreen from './screens/ListaScreen';
import AddScreen from './screens/AddScreen';

// Definindo o tipo das rotas do Stack Navigator
export type RootStackParamList = {
  Home: undefined;
  Lista: undefined;
  Add: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Remove o cabeçalho
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lista" component={ListaScreen} />
        <Stack.Screen name="Add" component={AddScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
