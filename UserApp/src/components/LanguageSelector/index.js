/**
 * src/components/LanguageSelector/index.js
 * Seletor de idiomas para React Native (drawer navigation)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTranslateContext } from '../../contexts/TranslateContext';
import { MaterialIcons } from '@expo/vector-icons';

const LanguageSelector = ({ containerStyle = {}, textStyle = {} }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, getLanguageInfo, getLanguageOptions } = useTranslateContext();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLangInfo = getLanguageInfo();
  const languages = getLanguageOptions();

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageOption,
        currentLanguage === item.code && styles.selectedLanguageOption
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <View style={styles.languageContent}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageTextContainer}>
          <Text style={[
            styles.languageName,
            currentLanguage === item.code && styles.selectedLanguageName
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.languageCode,
            currentLanguage === item.code && styles.selectedLanguageCode
          ]}>
            {item.code}
          </Text>
        </View>
      </View>
      {currentLanguage === item.code && (
        <MaterialIcons
          name="check-circle"
          size={24}
          color="#4DCE4D"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.currentLanguage}>
          <Text style={styles.currentFlag}>{currentLangInfo.flag}</Text>
          <View style={styles.currentLanguageTextContainer}>
            <Text style={[styles.currentLanguageName, textStyle]}>
              {currentLangInfo.name}
            </Text>
            <Text style={[styles.currentLanguageCode, textStyle]}>
              {t('language.current')}: {currentLanguage}
            </Text>
          </View>
        </View>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="#5D5D5D"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('language.select')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#5D5D5D" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              style={styles.languagesList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currentLanguageTextContainer: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  currentLanguageCode: {
    fontSize: 12,
    color: '#5D5D5D',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  languagesList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
  selectedLanguageOption: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#4DCE4D',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 15,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  selectedLanguageName: {
    color: '#4DCE4D',
  },
  languageCode: {
    fontSize: 12,
    color: '#5D5D5D',
    marginTop: 2,
  },
  selectedLanguageCode: {
    color: '#4DCE4D',
  },
});

export default LanguageSelector;