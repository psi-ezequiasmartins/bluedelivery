/**
 * src/pages/User/SignUp3.js
 */

import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, ScrollView, Keyboard, Alert } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';

import icon from '../../../assets/icon.png';

export default function SignUp2(props) {
  // Refs para navegação entre campos
  const telefoneRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const confirmPasswordRef = React.useRef(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const nome = props.route.params.nome;
  const sobrenome = props.route.params.sobrenome;

  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const { signUp, loading } = useContext(AuthContext);
  const { pushToken } = useContext(NotificationContext);

  function checkEmptyField(field) {
    if (field.trim() === '') {
      return false;
    } else {
      return true;
    }
  }

  async function handleSignUp() {
    const vTelefone = checkEmptyField(telefone);
    const vEmail = checkEmptyField(email);
    const vPassword = checkEmptyField(password);

    if (!vTelefone || !vEmail || !vPassword) {
      Alert.alert('', t('signup.requiredFields'));
      return;
    }

    if (!pushToken) {
      Alert.alert('', 'Erro ao obter o Push Token. Verifique as permissões de notificação.');
      return;
    }

    await signUp(
      nome.trim(),
      sobrenome.trim(),
      telefone.trim(),
      email.trim(),
      password.trim(),
      confirm_password.trim(),
      pushToken.trim()
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : ''} enabled>
        <View style={styles.header}>
          <Image style={styles.logo} source={icon} resizeMode="contain" />
          <Text style={styles.subtitle}>{t('signup.subtitle2')}</Text>
          <Text style={styles.subtitle}>{t('signup.subtitle3')}</Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: 20 }]}
            keyboardShouldPersistTaps="handled"
            style={{ width: '100%' }}
          >
            <View style={styles.areaInput}>
              <Text style={{ marginBottom: 5 }}>{t('signup.phoneLabel')}</Text>
              <MaskedTextInput
                ref={telefoneRef}
                value={telefone}
                mask={"(99) 99999-9999"}
                placeholder={t('signup.phonePlaceholder')}
                onChangeText={(masked, unmasked) => { setTelefone(masked) }}
                keyboardType="numeric"
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
              />
            </View>
            <View style={styles.areaInput}>
              <Text style={{ marginBottom: 5 }}>{t('signup.emailLabel')}</Text>
              <TextInput
                ref={emailRef}
                value={email}
                onChangeText={(input) => setEmail(input)}
                placeholder={t('signup.emailPlaceholder')}
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
              />
            </View>
            <View style={styles.areaInput}>
              <Text style={{ marginBottom: 5 }}>{t('signup.passwordLabel')}</Text>
              <TextInput
                ref={passwordRef}
                value={password}
                onChangeText={(input) => setPassword(input)}
                placeholder={t('signup.passwordPlaceholder')}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                keyboardType='numeric'
                textContentType='password'
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()}
              />
            </View>
            <View style={styles.areaInput}>
              <Text style={{ marginBottom: 5 }}>{t('signup.confirmPasswordLabel')}</Text>
              <TextInput
                ref={confirmPasswordRef}
                value={confirm_password}
                onChangeText={(input) => setConfirmPassword(input)}
                placeholder={t('signup.confirmPasswordPlaceholder')}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                keyboardType='numeric'
                textContentType='password'
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Text style={{ fontSize: 12, textAlign: 'center', margin: 10 }} >
          (*) Ao clicar em "Registrar Usuário", você estará concordando automaticamente com a nossa Política de Uso e Privacidade. Dúvidas: acesse https://bluedelivery.tech
        </Text>
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSignUp}>
          {loading ? (
            <View style={styles.indicator}>
              <Text style={styles.btnTxt}>{t('signup.wait')}</Text>
              <ActivityIndicator size="large" color='#FFF333' />
            </View>
          ) : (
            <Text style={styles.btnTxt}>{t('signup.register')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => navigation.goBack()}>
          <Text style={styles.btnTxt}>{t('signup.back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.linkTxt}>{t('signup.haveAccount')}</Text>
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
    margin: 5,
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
  }
})
