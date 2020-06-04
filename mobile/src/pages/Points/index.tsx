import React, {useState, useEffect} from 'react';

import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {useNavigation,useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {SvgUri} from 'react-native-svg';
import * as Location from 'expo-location'

import api from '../../services/api';

import styles from './styles';

interface ItemProps {
   id: number;
   title: string;
   image_url: string;
}

interface PointProps {
   id: number;
   name: string;
   image: string;
   latitude: number,
   longitude: number,
}

interface Params {
   uf: string;
   city: string;
}

const Points = () => {
   const [items, setItems] = useState<ItemProps[]>([]);
   const [selectedItems, setSelectedItems] = useState<number[]>([]);
   const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
   const [points, setPoints] = useState<PointProps[]>([])

   const route = useRoute();
   const navigation = useNavigation();

   const routeParams = route.params as Params;

   useEffect(() => {
      api.get('items').then( res => {
         setItems(res.data);
      })
   }, [])

   useEffect(() => {
      async function loadPosition() {
         const { status } = await Location.requestPermissionsAsync();

         if (status !== 'granted') {
            Alert.alert('Oooopsss', 'Precisamos da sua permissão para obter a localização')
         }

         const location = await Location.getCurrentPositionAsync();

         const {latitude, longitude} = location.coords

         setInitialPosition([latitude,longitude]);
      }

      loadPosition()
   }, [])

   useEffect(() => {
      const {city, uf} = routeParams;
      
      api.get('points', {
         params: {
            city,
            uf,
            items: selectedItems
         }
      }).then(res => {
         setPoints(res.data)
      })
   }, [selectedItems])

   function handleNavigationBack() {
      navigation.goBack();
   }

   function handleNavigationToDetail(id: number) {
      navigation.navigate('Detail', {point_id: id});
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

            <Text style={styles.title}>Bem vindo 😄</Text>
            <Text style={styles.description}>Encontre no mapa um Ponto de Coleta.</Text>

            <View style={styles.mapContainer}>
            { initialPosition[0] !== 0 && (
               <MapView  
                  loadingEnabled={initialPosition[0] === 0}
                  initialRegion={{
                     latitude: initialPosition[0], 
                     longitude: initialPosition[1],
                     latitudeDelta: 0.016,
                     longitudeDelta: 0.016
                  }} 
                  style={styles.map} 
               >
               {points.map(p => (
                  <Marker 
                     key={String(p.id)}
                     coordinate={{
                        latitude: p.latitude, 
                        longitude: p.longitude,
                     }}
                     onPress={() => {handleNavigationToDetail(p.id)}}
                  >
                     <View style={styles.mapMarkerContainer}>
                        <Image
                           style={styles.mapMarkerImage} 
                           source={{ uri: p.image}}
                        />
                        <Text style={styles.mapMarkerTitle}>
                           {p.name}
                        </Text>
                     </View>
                  </Marker>
               ))}
               </MapView>
            )}
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