
// =================== NOVO BLOCO ADAPTADO DA V3.0 ===================
import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut as firebaseSignOut } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { auth, firebase_app } from '../config/apiFirebase';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/apiAxios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const db = getDatabase(firebase_app);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    checkTokenValidity();
  }, []);

  async function signIn(email, password) {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;
      const snapshot = await get(ref(db, `users/${id}`));
      const rtdbData = snapshot.val() || {};
      const userId = rtdbData.UserID;
      let pushToken = rtdbData.PushToken;

      if (!userId) {
        Alert.alert('Erro ao recuperar o UserID. Tente novamente.');
        setLoading(false);
        return;
      }

      if (!pushToken) {
        pushToken = await registerForPushNotifications();
        if (pushToken) {
          await set(ref(db, `users/${id}/PushToken`), pushToken);
        }
      }

      // Autenticação JWT
      const authResponse = await api.post('/api/user/authenticate', {
        USER_ID: userId,
        CHV: 1,
        timezoneOffset: new Date().getTimezoneOffset(),
      });
      const token = authResponse.data?.token;
      const expiresAt = Date.now() + authResponse.data.expiresIn * 1000;
      if (!token) throw new Error('Token não encontrado na resposta do backend.');
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('expiresAt', expiresAt.toString());

      // Dados complementares do usuário via backend
      const response = await api.get(`/api/user/${userId}`);
      const apiData = response.data[0] || {};

      // Monta objeto user completo, priorizando dados do backend, fallback para RTDB
      const userObj = {
        USER_ID: apiData.USER_ID || rtdbData.UserID || '',
        NOME: apiData.NOME || rtdbData.Nome || '',
        SOBRENOME: apiData.SOBRENOME || rtdbData.Sobrenome || '',
        EMAIL: apiData.EMAIL || rtdbData.Email || '',
        TELEFONE: apiData.TELEFONE || rtdbData.Telefone || '',
        URL_IMAGEM: apiData.URL_IMAGEM || rtdbData.UrlImagem || 'https://via.placeholder.com/250',
        PUSH_TOKEN: pushToken || rtdbData.PushToken || ''
      };

      // Atualiza RTDB com dados completos
      await set(ref(db, 'users/' + id), {
        UserID: userObj.USER_ID,
        Nome: userObj.NOME,
        Sobrenome: userObj.SOBRENOME,
        Email: userObj.EMAIL,
        Telefone: userObj.TELEFONE,
        UrlImagem: userObj.URL_IMAGEM,
        PushToken: userObj.PUSH_TOKEN
      });

      // Salva no AsyncStorage
      await AsyncStorage.multiSet([
        ["vUserID", String(userObj.USER_ID)],
        ["vNome", userObj.NOME],
        ["vSobrenome", userObj.SOBRENOME],
        ["vTelefone", userObj.TELEFONE],
        ["vEmail", userObj.EMAIL],
        ["vPushToken", userObj.PUSH_TOKEN],
        ["vUrlImagem", userObj.URL_IMAGEM],
      ]);

      setUser(userObj);
      setAuthenticated(true);
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Email e/ou Senha inválidos ou erro na autenticação.');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(nome, sobrenome, telefone, email, password, confirm_password, pushToken) {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Favor preencher todos os campos!');
      setLoading(false);
      return;
    }
    if (password !== confirm_password) {
      Alert.alert('As senhas não conferem! Digite-as novamente');
      setLoading(false);
      return;
    }

    if (!pushToken) {
      pushToken = await registerForPushNotifications();
    }

    try {
      // const pushToken = await registerForPushNotifications();
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;
      const json = {
        USER_ID: null,
        FIREBASE_UID: uid,
        NOME: nome,
        SOBRENOME: sobrenome,
        TELEFONE: telefone,
        EMAIL: email,
        SENHA: password,
        URL_IMAGEM: 'https://via.placeholder.com/250',
        CHV: 1
      };
      const result = await api.post('/api/add/usuario/', json);
      await set(ref(db, 'users/' + uid), {
        UserID: result.data.USER_ID,
        Nome: result.data.NOME,
        Sobrenome: result.data.SOBRENOME,
        Telefone: result.data.TELEFONE,
        Email: result.data.EMAIL,
        UrlImagem: result.data.URL_IMAGEM,
        PushToken: pushToken || ''
      });
      await AsyncStorage.multiSet([
        ["vUserID", String(result.data.USER_ID)],
        ["vNome", result.data.NOME],
        ["vSobrenome", result.data.SOBRENOME],
        ["vTelefone", result.data.TELEFONE],
        ["vEmail", result.data.EMAIL],
        ["vPushToken", pushToken || ''],
        ["vUrlImagem", result.data.URL_IMAGEM],
      ]);
      Alert.alert('Usuário registrado com sucesso!');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      Alert.alert('Erro ao registrar usuário. Tente novamente.');
      setLoading(false);
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setAuthenticated(false);
    api.defaults.headers['Authorization'] = undefined;
    AsyncStorage.multiRemove(["token", "expiresAt", "vUserID", "vNome", "vSobrenome", "vTelefone", "vEmail", "vPushToken", "vUrlImagem"]);
    console.clear();
    setUser(null);
  }

  function changePassword(email) {
    sendPasswordResetEmail(auth, email).then(() => {
      Alert.alert("Email de Recuperação enviado com sucesso! Confira sua caixa de Entrada.");
      setAuthenticated(false);
    }).catch(error => {
      Alert.alert('Erro ao enviar email: ' + error.message);
      setAuthenticated(false);
    });
  }

  async function checkTokenValidity() {
    try {
      const token = await AsyncStorage.getItem('token');
      const expiresAt = await AsyncStorage.getItem('expiresAt');
      if (token && expiresAt) {
        const now = Date.now();
        if (now >= Number(expiresAt)) {
          await AsyncStorage.multiRemove(['token', 'expiresAt']);
          setAuthenticated(false);
          setUser(null);
          Alert.alert('Sessão expirada. Faça login novamente.');
        } else {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          setAuthenticated(true);
        }
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar a validade do token:', error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function registerForPushNotifications() {
    if (!Device.isDevice) {
      console.warn('Notificações push só estão disponíveis em dispositivos físicos.');
      return null;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Permissão para notificações push não concedida.');
      return null;
    }
    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    if (!expoPushToken) {
      console.error('Falha ao gerar o pushToken via expo-notifications.');
      return null;
    }
    return expoPushToken;
  }

  return (
    <AuthContext.Provider value={{
      signed: !!authenticated, user, setUser,
      loading, signIn, signUp, changePassword, signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

