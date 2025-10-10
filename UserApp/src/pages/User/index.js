/* 
* src/pages/User/index.js
* Blue Delivery - Perfil do usuário com i18n
*/

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';

import CameraModal from '../../components/CameraModal';

import Header from '../../components/Header';
import noImage from '../../../assets/noImage.png';
import api from '../../config/apiAxios';

export default function Perfil() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, setUser, signOut } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [nome, setNome] = useState(user?.NOME || '');
  const [sobrenome, setSobrenome] = useState(user?.SOBRENOME || '');
  const [url_imagem, setUrlImagem] = useState(user?.URL_IMAGEM || '');
  const [telefone, setTelefone] = useState(user?.TELEFONE || '');
  const [email, setEmail] = useState(user?.EMAIL || '');

  function onCapture(uri) {
    setPhoto(uri); // Obs.: subir para storage/backend se necessário
    setUrlImagem(uri);
    setVisible(false);
    Alert.alert('Foto capturada com sucesso!');
  }

  async function onSave() {
    await updateUser();
    if (user && user.USER_ID) {
      navigation.navigate('HomeDrawer');
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  }

  async function updateUser() {
    const json = {
      NOME: nome,
      SOBRENOME: sobrenome,
      EMAIL: email,
      TELEFONE: telefone,
      URL_IMAGEM: url_imagem,
    };
    try {
      const response = await api.put(`/api/update/usuario/${user?.USER_ID}`, json);
      setUser(response.data || json);
      Alert.alert('Dados atualizados com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>Perfil do Usuário</Text>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  photo ? { uri: photo } :
                    (url_imagem && url_imagem !== '') ? { uri: url_imagem } :
                      noImage
                }
                style={styles.avatarImage}
              />
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
              >
                <Feather name="camera" size={32} color="#FFF" />
              </TouchableOpacity>
            </View>
            <CameraModal visible={visible} onClose={() => setVisible(false)} onCapture={onCapture} />
          </View>

          <View style={styles.areaInput}>
            <Text style={styles.label}>{t('user.userId')} ({t('user.userId')} Nº):</Text>
            <TextInput
              value={String(user?.USER_ID)}
              placeholder={String(user?.USER_ID)}
              style={[styles.input, { backgroundColor: '#EEE', color: '#0033CC' }]}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.rowInput}>
            <View style={[styles.areaInput, { flex: 1, marginRight: 6 }]}>
              <Text style={styles.label}>{t('user.name')}:</Text>
              <TextInput
                value={nome}
                placeholder={t('user.name')}
                autoCorrect={false}
                onChangeText={setNome}
                autoCapitalize="words"
                style={styles.input}
                placeholderTextColor="#AAA"
              />
            </View>

            <View style={[styles.areaInput, { flex: 1, marginLeft: 6 }]}>
              <Text style={styles.label}>{t('user.lastName')}:</Text>
              <TextInput
                value={sobrenome}
                placeholder={t('user.lastName')}
                onChangeText={setSobrenome}
                autoCapitalize="words"
                style={styles.input}
                placeholderTextColor="#AAA"
              />
            </View>
          </View>

          <View style={styles.areaInput}>
            <Text style={styles.label}>{t('user.phone')}:</Text>
            <MaskedTextInput
              value={telefone}
              mask="(99) 99999-9999"
              placeholder="(31) 99999-9999"
              onChangeText={setTelefone}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#AAA"
            />
          </View>

          <View style={styles.areaInput}>
            <Text style={styles.label}>{t('user.email')}:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="username@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
              placeholderTextColor="#AAA"
            />
          </View>

          <TouchableOpacity style={styles.btnSubmit} onPress={onSave}>
            <Text style={styles.btnTxt}>{t('profile.updateData').toUpperCase()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnLogout} onPress={signOut}>
            <Text style={styles.btnTxt}>{t('navigation.logout').toUpperCase()}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '98%',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  subtitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    height: 220,
  },
  avatarWrapper: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 250,
    height: 250,
    borderRadius: 150,
    backgroundColor: '#EEE',
  },
  cameraIcon: {
    position: 'absolute',
    right: -15,
    bottom: 5,
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 7,
    elevation: 3,
  },
  rowInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  areaInput: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: '#000',
    fontSize: 15,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 45,
    padding: 10,
    backgroundColor: '#FFF',
    borderColor: '#8CB8D2',
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: '#000',
  },
  btnSubmit: {
    width: '95%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  btnLogout: {
    width: '95%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  btnTxt: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
  },
})

/*
{
    "UserID": 100001,
    "Nome": "Ezequias",
    "Sobrenome": "Martins",
    "UrlImagem": "https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/usuarios%2Fezequiasmartins.jpg?alt=media&token=873161e8-922e-49df-b5c1-0d200023e326",
    "Email": "ezequiasmartins@gmail.com",
    "Telefone": "+55 31 98410-7540",
    "Endereco": "Rua dos Comanches, 870 Santa Mônica, Belo Horizonte, MG, 31530-250",
    "Latitude": -19.826617659416904, 
    "Longitude": -43.98354455908985,
    "TokenUSR": ""
}
*/

/**
 ** tabela de cores: #FFB901 #55A9D6 #7F7B7B #5D5D5D #FF0000 #0033CC #FFF000 #131313 #4DCE4D
 */