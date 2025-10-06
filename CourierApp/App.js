import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import AuthContextProvider from './src/contexts/AuthContext';
import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <StatusBar style="dark" backgroundColor='#FFCC33'/>
        <Routes/>
      </AuthContextProvider>
    </NavigationContainer>
  );
}
