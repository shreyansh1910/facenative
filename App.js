
import React, { useState } from 'react';
import { View, Button, Image, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [selectedimage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [targetimage, setTargetImage] = useState(null);
  const [colors, setColor] = useState(false);
  const selectImage = async (url) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to upload an image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      console.log(result)

      if (!result.canceled) {
        uploadImage(result.assets[0].uri, url)
        return (result.assets[0].uri)
      }
    } catch (error) {
      console.log('Error selecting image:', error);
      // Handle the error here (e.g., show an error message)
    }
  };
  const uploadImage = async (selectedImage, url) => {
    try {

      if (selectedImage === null) {
        Alert.alert('No image selected', 'Please select an image before uploading');
        return;
      }
      const pathComponents = selectedImage.split('/');
      const filenameWithExtension = pathComponents.pop();
      const extension = filenameWithExtension.split('.')[1];
      const mediatype = 'image/' + extension
      console.log(pathComponents)
      console.log(filenameWithExtension)
      console.log(extension)

      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        name: filenameWithExtension, // Change the filename as needed
        type: mediatype, // Change the file type as needed
      });
      const headers = {
        'Content-Type': 'multipart/form-data',

      };

      const response = await axios.post(url, formData, { headers });

      if (response) {
        console.log(response.data)

      } else {
        console.log("msg failed to upload the image")
      }
    } catch (error) {
      console.log('Error uploading image:', error);
      // Handle the error here (e.g., show an error message)
    }
  };
  async function source() {
    setSelectedImage(await selectImage('https://8a0f-183-83-216-62.ngrok-free.app/media/upload/source_img'));
  }
  async function target() {
    setTargetImage(await selectImage('https://8a0f-183-83-216-62.ngrok-free.app/media/upload/target'));
  }
  async function start() {
    setColor(true);
    try {
      const response = await axios.get('https://8a0f-183-83-216-62.ngrok-free.app/start', {
        responseType: 'blob',
      });

      const blob = await response.data;
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        setImageData(base64Data)
        setColor(false);
        console.log(base64Data);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error retrieving image:', error);
    }
  }

  var texts = colors ? "Loading.." : "CreateAvatar";


  return (
    <View style={{ marginTop: 50 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}><Button title='Input Image' onPress={source}></Button></View>
        <View style={{ flex: 1 }}><Button title='Filter Image' onPress={target}></Button></View>

      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          {selectedimage && <Image source={{ uri: selectedimage }} style={{ height: 200 }} resizeMode='cover' />}
        </View>

        <View style={{ flex: 1 }}>
          {targetimage && <Image source={{ uri: targetimage }} style={{ height: 200 }} resizeMode='cover' />}
        </View>

      </View>
      <View style={{ height: 10 }}></View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={start}>
          <Text style={styles.buttonText}>{texts}</Text>
        </TouchableOpacity>
      </View>


      <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ height: 30 }}></View>
        {imageData && <Image source={{ uri: imageData }} style={{ width: 320, height: 320 }} />}
      </View>


    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#009ACD',
    padding: 10,
    borderRadius: 10,


  },
  buttonText: {
    backgroundColor: '#009ACD',
    fontSize: 20,
    color: 'white'
    // Other dark mode styles
  },
});


