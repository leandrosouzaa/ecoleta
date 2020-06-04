import React from 'react';

import { ImageBackground, View,Text, Image} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons'

import styles from './styles'

const Home = () => {
  return (
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
        <RectButton style={styles.button} onPress={() => {}}>
          <View style={styles.buttonIcon}>
            <Feather name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home;