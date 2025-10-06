/**
 * src/context/AuthContext.js
 */

import { useState, createContext } from 'react';
import { Alert } from 'react-native';
import { firebase_app } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get, child, update } from "firebase/database";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import api from '../config/mysql';

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }) {
  const auth = getAuth(firebase_app);
  const database = getDatabase(firebase_app);
  const db = ref(database);

  const [ loading, setLoading ] = useState(false);
  const [ courier, setCourier ] = useState(null);
  const [ token_crr, setTokenCRR ] = useState("");

  function SetNotificationSMS(notification) {
    setNotify(notification);
  }

  async function checkTokenValidity(pushToken) {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de notificação não concedida.');
        return false;
      }
      const notification = {
        "to": pushToken,
        "title": "DeliveryBairro.com",
        "body": "Verificação de Token: "+pushToken,
      };
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        "method": 'POST',
        "headers": {
          "Accept": 'application/json',
          'Content-Type': 'application/json',
        },
        "body": JSON.stringify(notification),
      });
      const result = await response.json();
      if (result.data && result.data[0].status === 'ok') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Erro ao verificar a validade do token:', error);
      return false;
    }
  }

  // LOGAR COURIER

  async function signIn(email, password) {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      get(child(db, `couriers/${user.id}`)).then(async(snapshot) => {
        let data = {
          "CourierID": snapshot.val().CourierID,
          "Nome": snapshot.val().Nome,
          "Sobrenome": snapshot.val().Sobrenome,
          "Telefone": snapshot.val().Telefone,
          "Email": snapshot.val().Email,
          "Endereco": snapshot.val().Endereco,
          "TokenCRR": snapshot.val().TokenCRR,
        }
        setTokenCRR(data.TokenCRR);
        setCourier(data);
      });

      const isTokenValid = checkTokenValidity(token_crr);
      if (!isTokenValid) {
        registerForPushNotificationsAsync().then(async(token) => {
          setTokenCRR(token);
          await update(child(db, `couriers/${id}`), {
            "TokenCRR": token_crr
          });
        });
      }

      setLoading(false);
    }).catch((error) => {
      setLoading(false);
      Alert.alert('Não foi possível efetuar o Login, verifique suas credenciais.')
      console.log(error.code, error.message);
    });
  }

  // CADASTRAR COURIER

  async function signUp(nome, sobrenome, endereco, complemento, bairro, cidade, UF, CEP, telefone, email, password) {
    setLoading(true);
    registerForPushNotificationsAsync().then((token) => {
      setTokenCRR(token);
    });

    const json = {
      "CourierID": null, 
      "Nome": nome, 
      "Sobrenome": sobrenome,
      "UrlImagem": "https://via.placeholder.com/200x200",
      "Endereco": endereco+" "+complemento+","+bairro+","+cidade+"-"+UF+" "+CEP, 
      "Email": email, 
      "Telefone": telefone, 
      // "Latitude": "", //-19.826263428, 
      // "Longitude": "", //-43.980335236, 
      "TokenCRR": token_crr
    }

    await api.post('/add/courier/', json).then(response => {
      createUserWithEmailAndPassword(auth, email, password).then(async(value) => {
        let id = value.user.uid;
        await set(ref(database, `users/${id}`), {
          "CourierID": response.data.UserID,
          "Nome": json.Nome,
          "Sobrenome": json.Sobrenome,
          "Telefone": json.Telefone,
          "Email": json.Email,
          "Endereco": json.Endereco,
          "TokenCRR": token_usr,
        });
        let data = {
          "UserID": response.data.UserID,
          "Nome": response.data.Nome,
          "Sobrenome": response.data.Sobrenome,
          "Telefone": response.data.Telefone,
          "Email": response.data.Email,
          "Endereco": response.data.Endereco,
          "TokenCRR": token_crr,
        }
        setCourier(data);
        setLoading(false);
      }).catch(error => {
        setLoading(false);
        console.log('ERROR: ' + error);
      })
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Falha ao obter Token push para notificação push!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('É necessário um dispositivo físico para notificações push');
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        "name": 'default',
        "importance": Notifications.AndroidImportance.MAX,
        "vibrationPattern": [0, 250, 250, 250],
        "lightColor": '#4DCE4D',
      });
    }
    return token;
  };

  // DESLOGAR COURIER

  async function signOut() {
    await auth.signOut();
    setUser(null);
  }

  return(
    <AuthContext.Provider value={{ 
      signed: !!courier, courier, setCourier, loading, notify, token_crr,
      signIn, signUp, signOut, SetNotificationSMS
    }}>
      { children }
    </AuthContext.Provider> 
  )
}
