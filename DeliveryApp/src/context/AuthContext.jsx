/**
 * src/context/AuthContext.jsx
 */

import React, { createContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, get, ref, set} from "firebase/database"; //, onValue 
import { firebase_app } from '../config/apiFirebase';
import api from '../config/apiAxios';
import socket from '../config/socket';

const auth = getAuth(firebase_app);
const db = getDatabase();

const AuthContext = createContext();

function AuthProvider({children}){
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ msg, setMessage ] = useState('');
  const [ result, setResult ]= useState('');
  // const [ fcmToken, setFcmToken ] = useState(null);
  const [ socketConnected, setSocketConnected ] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
      // Conecta ao WebSocket com JWT
      socket.auth = { token: JSON.parse(token) };
      socket.connect();
      setSocketConnected(true);
  // ...apenas WebSocket, sem FCM...
    }
    setLoading(false);
    // Escuta eventos do WebSocket
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('order_update', (data) => {
      // Atualização de pedidos em tempo real
      setMessage(`Pedido atualizado: ${data.status}`);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('order_update');
      socket.disconnect();
    };
  }, []);
  
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000); // Oculta a mensagem após 3 segundos
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [msg]);

  async function signIn(email, password) {
    setLoading(true);
    setMessage('');
    try {
      // Autentica com Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password);
      const id = result.user.uid;

      // Busca dados do usuário no Realtime Database
      const userDataRef = ref(db, 'users/' + id);
      const snapshot = await get(userDataRef);
      const data = snapshot.val();

      if (!data) {
        throw new Error('Dados do usuário não encontrados no Firebase');
      }

      // Armazena dados no localStorage
      localStorage.setItem("vID", data.DeliveryID);
      localStorage.setItem("vDelivery", data.DeliveryName);
      localStorage.setItem("vMail", data.DeliveryMail);

      const vID = parseFloat(localStorage.getItem("vID"));
      const vDelivery = localStorage.getItem("vDelivery");
      const vMail = localStorage.getItem("vMail");

      console.log('Dados recuperados do Firebase Auth: ', vID, vDelivery, vMail);

      // Autentica com a API própria
      const response = await api.post('/api/delivery/authenticate', {
        USER_ID: vID,
        CHV: 1,
        timezoneOffset: new Date().getTimezoneOffset()
      });

      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', JSON.stringify(token));
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setAuthenticated(true);
        setResult('S');
        // Conecta ao WebSocket com JWT
        socket.auth = { token };
        socket.connect();
        setSocketConnected(true);
        // ...apenas WebSocket, sem FCM...
        setLoading(false);
      } else {
        throw new Error('Token não encontrado na resposta da API');
      }

    } catch (error) {
      console.error('Erro durante o processo de login:', error);
      setAuthenticated(false);
      setMessage('E-mail e/ou senha inválidos!');
      setResult('N');
    }
  }

  function signUp(delivery, email, password, confirm_password) {
    setMessage('');
    setLoading(true);

    if (!email || !password) {
      setMessage('Favor preencher todos os campos!');
      return;
    }

    if (password !== confirm_password) {
      setMessage('As senhas não conferem! Digite-as novamente');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password).then(async(result) => {
      // SIGNED IN
      const id = result.user.uid;
      const response = await api.post('/api/delivery/authenticate', { USER_ID: id, CHV: 1 });
      const token = response.data?.token; // Token JWT enviado pelo backend
      const userId = response.data?.userId; // ID do delivery retornado pelo backend
      if (token) { 

        set(ref(db, 'users/'+id), {
          DeliveryID: userId,
          DeliveryName: delivery,
          DeliveryMail: email
        });

        // Armazena o token e dados do usuário no localStorage
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem("vID", userId);
        localStorage.setItem("vDelivery", delivery);
        localStorage.setItem("vMail", email);

        api.defaults.headers.Authorization = `Bearer ${token}`;
        setLoading(false);
        setAuthenticated(true);
        setMessage('Cadastro efetuado com sucesso!');
        setResult('S');
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    }).catch((error) => {
      console.log(error.code, error.message);
      setLoading(false);
      setAuthenticated(false);
      setResult('N');
      if (error.message === 'Password should be at least 6 characters') {
        setMessage('A senha deverá conter pelo menos 6 caracteres'); 
      } else 
      if (error.message === 'The email address is badly formatted.') {
        setMessage('O formato do E-mail está incorreto') 
      } else
      if (error.message === 'The email address is already in use by another account.') {
        setMessage('E-mail já em uso por outra conta');
      } else {
        setMessage('Erro ao criar conta: ' + error.message);
      }
    });
  }

  function changePassword(email) {
    sendPasswordResetEmail(auth, email).then(() => {
      setMessage("Email de Recuperação enviado com sucesso! Confira sua caixa de Entrada.");
      setAuthenticated(false);
    }).catch(error => {
      setMessage('Erro ao enviar email: ' + error.message);
      setAuthenticated(false);
    })
  }

  function signOut() {
    setAuthenticated(false);
    api.defaults.headers.Authorization = undefined;
    localStorage.removeItem("token");
    localStorage.removeItem("vID");
    localStorage.removeItem("vDelivery");
    localStorage.removeItem("vMail");
    localStorage.removeItem("firebase:host:psi-deliverybairro-default-rtdb.firebaseio.com");
    // setFcmToken(null);
    if (socketConnected) {
      socket.disconnect();
      setSocketConnected(false);
    }
    console.clear();
  }

  return (
    <AuthContext.Provider value={{ loading, msg, result, authenticated, signIn, signUp, changePassword, signOut, socketConnected }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider };
