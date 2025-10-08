/**
 * src/pages/User/SignIn.js
 * Blue Delivery - Tela de login com sistema i18n
 */

import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslateContext } from '../../contexts/TranslateContext';

import logo from '../../../assets/logo.png';

export default function SignIn() {
  const { t } = useTranslation();
  const { changeLanguage, getLanguageOptions } = useTranslateContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, loading } = useContext(AuthContext);
  const languages = getLanguageOptions();

  async function handleLogin(email, password) {
    signIn(email, password);
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

        <View style={styles.header}>
          <Image style={styles.logo} source={logo} resizeMode="contain" />
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>UserApp v1.0</Text>
        </View>

        <View style={styles.areaInput}>
          <Text style={{ marginBottom: 10 }}>{t('auth.email')}:</Text>
          <TextInput
            value={email}
            onChangeText={(input) => setEmail(input)}
            placeholder='username@email.com'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <View style={styles.areaInput}>
          <Text style={{ marginBottom: 10 }}>{t('auth.password')}:</Text>
          <TextInput
            value={password}
            onChangeText={(input) => setPassword(input)}
            placeholder={t('auth.password') + ' (6 dígitos numéricos)'}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            keyboardType='numeric'
            textContentType='password'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={() => handleLogin(email, password)}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>{t('common.loading')} </Text>
              <ActivityIndicator size="large" color='#FFF999' />
            </View>
          ) : (
            <Text style={styles.btnTxt}>{t('auth.login').toUpperCase()}</Text>
          )}
        </TouchableOpacity>

        {/* Seletor discreto de idiomas - apenas bandeiras */}
        <View style={styles.flagSelector}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.flagButton}
              onPress={() => changeLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flagEmoji}>{lang.flag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp1')}>
          <Text style={styles.linkTxt}>{t('messages.registerPrompt')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Reset')}>
          <Text style={styles.linkTxt}>{t('messages.forgotPassword')}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 21,
  },
  subtitle: {
    color: '#000',
    textAlign: "center",
    fontSize: 15,
  },
  logo: {
    width: 200,
    height: 200
  },
  marca: {
    width: 200,
    height: 70,
    marginBottom: 15
  },
  areaInput: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
    marginBottom: 10
  },
  input: {
    width: "95%",
    height: 50,
    backgroundColor: "#FFF",
    padding: 10,
    borderColor: "#8CB8D2",
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 17,
    color: "#000",
  },
  btnSubmit: {
    width: "95%",
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    margin: 10,
  },
  btnTxt: {
    color: "#FFF",
    fontSize: 20,
    textAlign: "center",
  },
  link: {
    marginTop: 10,
  },
  linkTxt: {
    textAlign: "center",
    color: "#000",
  },
  indicator: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Seletor discreto de idiomas - apenas bandeiras
  flagSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
    gap: 20,
  },
  flagButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  flagEmoji: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 32,
  },
})
