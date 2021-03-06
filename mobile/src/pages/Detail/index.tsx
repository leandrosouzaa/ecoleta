import React, { useEffect, useState } from 'react';

import { Linking } from 'expo';
import {useNavigation, useRoute} from '@react-navigation/native'
import { View, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import {Feather as Icon, FontAwesome} from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer'
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';
import api from '../../services/api';

interface Params {
   point_id: number;
}

interface DataProps {
   point: {
      image_url: string;
      name: string;
      email: string;
      whatsapp: string;
      city: string;
      uf: string;      
   },
   items: {
      title: string;
   }[],
}

const Detail = () => {
   const [data, setData] = useState<DataProps>({} as DataProps);

   const route = useRoute();
   const navigation = useNavigation();

   const routeParams = route.params as Params;

   useEffect(() => {
      api.get(`points/${routeParams.point_id}`).then(res => {
         setData(res.data)
      })
   }, [])

   function handleNavigationBack() {
      navigation.goBack();
   }

   if (!data.point) {
      return null;
   }

   function handleComposeMail() {
      MailComposer.composeAsync({
         subject: `Interesse na coleta de resíduos`,
         recipients: [data.point.email],
      })
   }

   function handleWhatsapp() {
      Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Olá ${data.point.name}, como funciona a coleta de resíduos?`)
   }

   return (
      <SafeAreaView style={{flex: 1}}>
         <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigationBack}>
               <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>

            <Image 
               style={styles.pointImage} 
               source={{uri:data.point.image_url}}
            />

            <Text style={styles.pointName}>{data.point.name}</Text>
            <Text style={styles.pointItems}>
               {data.items.map(i => i.title).join(', ')}
            </Text>

            <View style={styles.address}>
               <Text style={styles.addressTitle}>Endereço</Text>
               <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
            </View>
         </View>
         <View style={styles.footer}>
            <RectButton style={styles.button} onPress={() => {handleWhatsapp()}}>
               <FontAwesome name="whatsapp" size={20} color="#FFF"/>
               <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton>
            <RectButton style={styles.button} onPress={() => {handleComposeMail()}}>
               <Icon name="mail" size={20} color="#FFF"/>
               <Text style={styles.buttonText}>E-Mail</Text>
            </RectButton>
         </View>
      </SafeAreaView>
   )
}

export default Detail