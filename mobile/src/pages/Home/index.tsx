import React, { useState } from 'react';

import { ImageBackground, View,Text, Image, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'

import styles from './styles'

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('')

  function handleNavigationToPoints() {
    navigation.navigate('Points', {city, uf})
  }

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? "padding" : undefined}
    > 
    <ImageBackground 
      source={require(('../../assets/home-background.png'))} 
      imageStyle={{height: 368, width: 274}}
      style={styles.container}
    >
      <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>
            Seu Marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
          </Text>
      </View>
      <View style={styles.footer}>
        <TextInput 
          style={styles.input} 
          placeholder='Digite a UF'
          value={uf}
          onChangeText={setUf}
          maxLength={2}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Digite a UF' 
          value={city}
          onChangeText={setCity}
          autoCorrect={false}
          autoCapitalize="words"
        />
        
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Feather name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  </KeyboardAvoidingView>
  )
}

export default Home;