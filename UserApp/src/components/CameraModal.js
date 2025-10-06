/**
 * src/components/CameraModal.js
 */

import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CameraModal({ visible, onClose, onCapture }) {
  const [preview, setPreview] = useState(null);

  async function pickFromGallery() {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (res.status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      onCapture?.(uri);
    }
  }

  async function takePhoto() {
    const res = await ImagePicker.requestCameraPermissionsAsync();
    if (res.status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      cameraType: 'front'
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      onCapture?.(uri);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Foto do perfil</Text>
          {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={pickFromGallery}>
              <MaterialIcons name="photo-library" size={28} color="#000" />
              <Text>Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={takePhoto}>
              <Feather name="camera" size={28} color="#000" />
              <Text>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <MaterialIcons name="close" size={28} color="#000" />
              <Text>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  sheet: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16 
  },
  title: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  btn: { 
    padding: 12, 
    backgroundColor: '#eee', 
    borderRadius: 8 
  },
  preview: { 
    height: 340, 
    borderRadius: 8,
    marginBottom: 12 
  }
});
