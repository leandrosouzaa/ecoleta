import React, { useState, useEffect } from 'react';

import { ImageBackground, View,Text, Image, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {RectButton} from 'react-native-gesture-handler';
import {Feather, Ionicons} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import axios from 'axios';

import styles from './styles'

interface IBGEUfResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface ItemsToSelect {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<ItemsToSelect[]>([])
  const [cities, setCities] = useState<ItemsToSelect[]>([])

  const [uf, setUf] = useState(null);
  const [city, setCity] = useState(null)

  function handleNavigationToPoints() {
    if (uf === null || city === null) {
      Alert.alert('Oppsss..', 'Parece que você informou dados inválidos. Selecione uma UF e uma cidade e tente novamente')
      return;
    }

    navigation.navigate('Points', {city, uf})
  }

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => {
        const ufsToSelect = res.data.map(i => {
          return {
            label: i.sigla,
            value: i.sigla
          }
        })
        setUfs(ufsToSelect);
      })
  }, [])

  useEffect(() => {
    if (uf === null) {
      return
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(res => {
        const citiesToSelect = res.data.map(i => {
          return {
            label: i.nome,
            value: i.nome
          }
        })
        console.log('chamou')
        setCities(citiesToSelect);
      })
  }, [uf])

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
      <View style={styles.input}>
        <RNPickerSelect
              style={{inputAndroid: {fontSize: 16}, inputIOS: {fontSize: 16}}}
              placeholder={{label: 'Selecione uma UF', value: null}}
              useNativeAndroidPickerStyle={false}
              onValueChange={(value) => setUf(value)}
              items={ufs}
              Icon={() => {
                return <Ionicons
                    name="ios-arrow-down"
                    size={24}
                    color="#34CB79"
                />
            }}
          />
      </View>

      <View style={styles.input}>
        <RNPickerSelect
              style={{inputAndroid: {fontSize: 16}, inputIOS: {fontSize: 16}}}
              placeholder={{label: 'Selecione uma Cidade', value: null}}
              useNativeAndroidPickerStyle={false}
              onValueChange={value => setCity(value)}
              value={city}
              items={cities}
              Icon={() => {
                return <Ionicons
                    name="ios-arrow-down"
                    size={24}
                    color="#34CB79"
                />
            }}
          />
      </View>
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