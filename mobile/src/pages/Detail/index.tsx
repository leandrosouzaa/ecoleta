import React from 'react';

import {useNavigation} from '@react-navigation/native'
import { View, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import {Feather as Icon, FontAwesome} from '@expo/vector-icons';

import styles from './styles';
import { RectButton } from 'react-native-gesture-handler';

const Detail = () => {
   const navigation = useNavigation();

   function handleNavigationBack() {
      navigation.goBack();
   }

   return (
      <SafeAreaView style={{flex: 1}}>
         <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigationBack}>
               <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>

            <Image 
               style={styles.pointImage} 
               source={{uri:'https://images.unsplash.com/photo-1583300919410-7b9186dac94a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}}
            />

            <Text style={styles.pointName}>Mercado do Seu Zé</Text>
            <Text style={styles.pointItems}>Lâmpadas, Óleo de Cozinha e batata</Text>

            <View style={styles.address}>
               <Text style={styles.addressTitle}>Endereço</Text>
               <Text style={styles.addressContent}>Presidente Venceslau, SP</Text>
            </View>
         </View>
         <View style={styles.footer}>
            <RectButton style={styles.button} onPress={() => {}}>
               <FontAwesome name="whatsapp" size={20} color="#FFF"/>
               <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton>
            <RectButton style={styles.button} onPress={() => {}}>
               <Icon name="mail" size={20} color="#FFF"/>
               <Text style={styles.buttonText}>E-Mail</Text>
            </RectButton>
         </View>
      </SafeAreaView>
   )
}

export default Detail