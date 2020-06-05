import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';

import {Link, useHistory} from 'react-router-dom';
import {Map, TileLayer, Marker} from 'react-leaflet';
import axios from 'axios'

import Dropzone from '../../components/Dropzone';
import api from '../../services/api'
import logo from '../../assets/logo.svg';
import './styles.css';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { LeafletMouseEvent } from 'leaflet';

interface ItemsProps {
   id: number;
   title: string;
   image_url: string;
};

interface IBGEUfResponse {
   sigla:string;
};

interface IBGECityResponse {
   nome: string;
}

const CreatePoint: React.FC = () => {
   const history = useHistory();

   const [status, setStatus ] = useState<'success' | 'error' | ''>('')

   const [items, setItems] = useState<ItemsProps[]>([]);
   const [selectedItems, setSelectedItems] = useState<number[]>([])
   
   const [selectedFile, setSelectedFile] = useState<File>();

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      whatsapp: '',
   })


   const [ufs, setUfs] = useState<string[]>([])
   const [selectedUf, setSelectedUF] = useState('0');

   const [cities, setCities] = useState<string[]>([])
   const [selectedCity, setSelectedCity] = useState('');

   const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
   const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

   useEffect(() => {
      api.get('items').then(res => {
         setItems(res.data)
      });
   }, []);

   useEffect(() => {
      axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
         .then (res => {
            const ufInitials = res.data.map(uf => uf.sigla);

            setUfs(ufInitials);
         })
   }, [])

   function handleSelectUf(e:ChangeEvent<HTMLSelectElement>) {
      const uf = e.target.value;
      setSelectedUF(uf);
   }

   useEffect(() => {
      if (selectedUf === '0') {
         return;
      }

      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
         .then(res => {
            const cityNames = res.data.map(c => (
               c.nome
            ))

            setCities(cityNames);
         })

   }, [selectedUf])

   function handleSelectCity(e:ChangeEvent<HTMLSelectElement>) {
      const city = e.target.value;
      setSelectedCity(city);
   }

   function handleMapClick(e:LeafletMouseEvent) {
      setSelectedPosition([
         e.latlng.lat, e.latlng.lng
      ])
   }

   useEffect(() => {
      navigator.geolocation.getCurrentPosition(position => {
         const {latitude, longitude} = position.coords;

         setInitialPosition([latitude, longitude])
      })
   }, [])

   function handleInputChange(e:ChangeEvent<HTMLInputElement>) {
      const {name, value} = e.target;

      setFormData({...formData, [name]:value})
   }

   function handleSelectItem(id: number) {
      if (selectedItems.includes(id)) {
         const selectedItemsUpdated = selectedItems.filter(i => i !== id)

         setSelectedItems(selectedItemsUpdated)

         return;
      }

      setSelectedItems([...selectedItems, id])
   }

   async function handleSubmit(e:FormEvent) {
      e.preventDefault();

      const {name, email, whatsapp} = formData;
      const uf = selectedUf;
      const city = selectedCity;
      const [latitude, longitude] = selectedPosition;
      const items = selectedItems;

      const data = new FormData();
         data.append('name',name);
         data.append('email',email);
         data.append('whatsapp',whatsapp);
         data.append('uf',uf);
         data.append('city',city);
         data.append('latitude',String(latitude));
         data.append('longitude',String(longitude));
         data.append('items',items.join(','));
         if (selectedFile) {
            data.append('image', selectedFile)
         }

      try {
         console.log('teste')
         await api.post('points', data);
         console.log('teste')
         setStatus('success');
      } catch(err) {
         console.log('caiu')
         setStatus('error');
      } finally {
         setTimeout(function(){ history.push('/') }, 3000);
      }
   }

   return (
      <div id="page-create-point">
         {status === 'success'  && 
            <div id="overlay">
               <FiCheckCircle size={64} color="#34CB79"/>
               <h1>Cadastro concluído! :D </h1>
            </div>
         }

         {status === 'error'  && 
            <div id="overlay">
               <FiAlertCircle size={64} color="#ff471a"/>
               <h1>Tivemos um Problema :( <br /> Tente novamente </h1>
            </div>
         }
         <header>
            <img src={logo} alt="Ecoleta"/>

            <Link to="/">
               <FiArrowLeft />
               Voltar para a home
            </Link>
         </header>

         <form onSubmit={handleSubmit}>
            <h1>Cadastro do <br /> ponto de coleta</h1>
            
            <Dropzone onFileUploaded={setSelectedFile} />

            <fieldset>
               <legend>
                  <h2>Dados</h2>
               </legend>

               <div className="field">
                  <label htmlFor="name">Nome da entidade</label>
                  <input onChange={handleInputChange} type="text" name="name" id="name"/>
               </div>

               <div className="field-group">
               <div className="field">
                  <label htmlFor="email">E-Mail</label>
                  <input onChange={handleInputChange} type="text" name="email" id="email"/>
               </div>

               <div className="field">
                  <label htmlFor="whatsapp">Whatsapp</label>
                  <input onChange={handleInputChange} type="text" name="whatsapp" id="whatsapp"/>
               </div>
               </div>
            </fieldset>


            <fieldset>
               <legend>
                  <h2>Endereços</h2>
                  <span>Selecione o endereço no mapa</span>
               </legend>

               <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                  <TileLayer
                     attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={selectedPosition} />

               </Map>

               <div className="field-group">
                  <div className="field">
                     <label htmlFor="uf">Estado (UF)</label>
                     <select value={selectedUf} onChange={handleSelectUf} name="uf" id="uf">
                        <option value="0">Selecione uma UF</option>
                        {ufs.map(uf => (
                           <option key={uf} value={uf}>{uf}</option>
                        ))}
                     </select>
                  </div>

                  <div className="field">
                     <label htmlFor="city">Cidade</label>
                     <select onChange={handleSelectCity} value={selectedCity} name="city" id="city">
                        <option value="0">Selecione uma cidade</option>
                        {cities.map(city => (
                           <option key={city} value={city}>{city}</option>
                        ))}
                     </select>
                  </div>
               </div>
            </fieldset>

            <fieldset>
               <legend>
                  <h2>Itens de Coleta</h2>
                  <span>Selecione um ou mais itens abaixo</span>
               </legend>

               <ul className="items-grid">
                  {
                     items.map(i => (
                     <li
                        key={i.id} 
                        onClick={() => handleSelectItem(i.id)}
                        className={selectedItems.includes(i.id) ? 'selected' : ''}
                     >
                        <img src={i.image_url} alt={i.title} />
                        <span>{i.title}</span>
                     </li>
                     ))
                  }
                  </ul>
            </fieldset>

            <button type="submit">
               Cadastrar ponto de coleta
            </button>
         </form>
      </div>
   );
};

export default CreatePoint;