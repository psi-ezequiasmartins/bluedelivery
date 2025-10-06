/**
 * src/routes/Auth.Routes.js
 */

import React from 'react';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import SignIn from '../pages/User/SignIn';
import SignUp1 from '../pages/User/SignUp1'; // passo 1 do cadastro de usuário (nome e sobrenome)
import SignUp2 from '../pages/User/SignUp2'; // passo 2 do cadastro de usuário (telefone, email e senha de acesso)
import Reset from '../pages/User/Reset';

const AuthStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: 'black',
    borderBottomWidth: 0,
  },
  headerTintColor: '#FFF',
  headerBackTitleVisible: false,
  headerTitle: 'Voltar',
};

export default function AuthRoutes() {
  return(
    <AuthStack.Navigator>
      <AuthStack.Screen 
        name="SignIn" 
        component={SignIn}
        options={{headerShown: false}}
      />
      <AuthStack.Screen 
        name="SignUp1" 
        component={SignUp1}
        options={screenOptions}
      />
      <AuthStack.Screen 
        name="SignUp2" 
        component={SignUp2}
        options={screenOptions}
      />
      <AuthStack.Screen 
        name="Reset" 
        component={Reset}
        options={screenOptions}
      />
    </AuthStack.Navigator>
  )
}
