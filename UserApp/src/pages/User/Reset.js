/**
 * src/pages/User/Reset.js
 */

import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, Keyboard, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';

import icon from '../../../assets/icon.png';
import marca from '../../../assets/logomarca.png';

export default function Reset() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { changePassword, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>

        <View style={styles.header}>
          <Image style={styles.logo} source={icon} resizeMode="contain" />
          <Image style={styles.marca} source={marca} resizeMode="contain" />
          <Text style={styles.title}>{t('reset.title')}</Text>
          <Text style={styles.subtitle}>{t('reset.subtitle')}</Text>
        </View>

        <View style={styles.areaInput}>
          <Text style={{ marginBottom: 10 }}>{t('auth.email')}:</Text>
          <TextInput
            value={email}
            onChangeText={(input) => setEmail(input)}
            placeholder={t('auth.emailPlaceholder')}
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            onSubmitEditing={() => Keyboard.dismiss()}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={() => signIn(email, password)}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>{t('common.loading')}... </Text>
              <ActivityIndicator size="large" color='#FFF999' />
            </View>
          ) : (
            <Text style={styles.btnTxt}>{t('reset.sendLink').toUpperCase()}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp1')}>
          <Text style={styles.linkTxt}>{t('reset.noAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkTxt}>{t('reset.backToLogin')}</Text>
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
    width: 100,
    height: 100
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
    marginBottom: 10,
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
  }
})
