import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Footer,About,Offerings, Whyanupaat,Home} from './containers';
import {Navbar,NotFound,Contact} from './components' ;
import AOS from 'aos';
import 'aos/dist/aos.css';

import './App.css' ;
AOS.init();

function App() {
 return (
  
    <BrowserRouter>
   <Navbar/>
      <Routes>
        <Route index element ={<Home/>}/>
        <Route path='home' element={<Home/>} />
        <Route path='about' element={<About/>}/>
        <Route path='whyanupaat' element={<Whyanupaat/>}/>

        <Route path='offerings' element={<Offerings/>}/>
        <Route path='contact' element={<Contact/>}/>
      
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      

       

      
       
       
      <Footer/>
    
     
    </BrowserRouter>
  );
}

export default App;
