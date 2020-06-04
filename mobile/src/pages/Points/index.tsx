import React, {useState, useEffect} from 'react';

import { View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';

import api from '../../services/api';

import styles from './styles';

interface ItemProps {
   id: number;
   title: string;
   image_url: string;
}

const Points = () => {
   const [items, setItems] = useState<ItemProps[]>([])
   const [selectedItems, setSelectedItems] = useState<number[]>([])

   const navigation = useNavigation();

   useEffect(() => {
      api.get('items').then( res => {
         setItems(res.data);
      })
   })

   function handleNavigationBack() {
      navigation.goBack();
   }

   function handleNavigationToDetail() {
      navigation.navigate('Detail');
   }

   function handleSelectItem(id: number) {
      if (selectedItems.includes(id)) {
         const selectedItemsUpdated = selectedItems.filter(i => i !== id)

         setSelectedItems(selectedItemsUpdated)

         return;
      }

      setSelectedItems([...selectedItems, id])
   }

   return (
      <>
         <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigationBack}>
               <Icon name="arrow-left" size={20} color="#34cb79" />
            </TouchableOpacity>

            <Text style={styles.title}>😄 Bem vindo.</Text>
            <Text style={styles.description}>Encontre no mapa um Ponto de Coleta.</Text>

            <View style={styles.mapContainer}>
               <MapView  
                  initialRegion={{
                     latitude: -21.8662371, 
                     longitude: -51.8438836,
                     latitudeDelta: 0.016,
                     longitudeDelta: 0.016
                  }} 
                  style={styles.map} 
               >
                  <Marker 
                     coordinate={{
                        latitude: -21.8662371, 
                        longitude: -51.8438836,
                     }}
                     onPress={handleNavigationToDetail}
                  >
                     <View style={styles.mapMarkerContainer}>
                        <Image
                           style={styles.mapMarkerImage} 
                           source={{ uri: 'https://images.unsplash.com/photo-1583300919410-7b9186dac94a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}}
                        />
                        <Text style={styles.mapMarkerTitle}>
                           Mercado
                        </Text>
                     </View>
                  </Marker>
               </MapView>
            </View>
         </View>


         <View style={styles.itemsContainer}>
            <ScrollView 
               contentContainerStyle={{paddingHorizontal: 20}} 
               horizontal 
               showsHorizontalScrollIndicator={false}
            >
               {items.map(i => (
                  <TouchableOpacity 
                     key={String(i.id)} 
                     style={[styles.item,selectedItems.includes(i.id) ? styles.selectedItem : {}]} 
                     onPress={() => {handleSelectItem(i.id)}} 
                     activeOpacity={0.6}
                  >
                     <SvgUri width={42} height={42} uri={i.image_url}/>
                     <Text style={styles.itemTitle}>{i.title}</Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>
         </View>
      </>
   )
}

export default Points