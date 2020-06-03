import React, {useEffect, useState, ChangeEvent} from 'react';

import {Link} from 'react-router-dom';
import {Map, TileLayer, Marker} from 'react-leaflet';
import axios from 'axios'

import api from '../../services/api'
import logo from '../../assets/logo.svg';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';

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
   const [items, setItems] = useState<ItemsProps[]>([]);
   const [ufs, setUfs] = useState<string[]>([])
   const [cities, setCities] = useState<string[]>([])
   const [selectedUf, setSelectedUF] = useState('0');
   const [selectedCity, setSelectedCity] = useState('');


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
   })

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

   return (
      <div id="page-create-point">
         <header>
            <img src={logo} alt="Ecoleta"/>

            <Link to="/">
               <FiArrowLeft />
               Voltar para a home
            </Link>
         </header>

         <form>
            <h1>Cadastro do <br /> ponto de coleta</h1>

            <fieldset>
               <legend>
                  <h2>Dados</h2>
               </legend>

               <div className="field">
                  <label htmlFor="name">Nome da entidade</label>
                  <input type="text" name="name" id="name"/>
               </div>

               <div className="field-group">
               <div className="field">
                  <label htmlFor="email">E-Mail</label>
                  <input type="text" name="email" id="email"/>
               </div>

               <div className="field">
                  <label htmlFor="whatsapp">Whatsapp</label>
                  <input type="text" name="whatsapp" id="whatsapp"/>
               </div>
               </div>
            </fieldset>


            <fieldset>
               <legend>
                  <h2>Endereços</h2>
                  <span>Selecione o endereço no mapa</span>
               </legend>

               <Map center={[-21.8693409, -51.8453466]} zoom={15}>
                  <TileLayer
                     attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[-21.8693409, -51.8453466]} />

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
                     <li key={i.id}>
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