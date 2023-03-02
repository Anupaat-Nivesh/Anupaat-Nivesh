import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Footer,About,Offerings, Whyanupaat,Home} from './containers';
import { Team, Brand ,Navbar,NotFound} from './components' ;

import './App.css' ;
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      
      
      <Routes>
        <Route path='home'element ={<Home/>}/>
        <Route path='about' element={<About/>}/>
        <Route path='whyanupaat' element={<Whyanupaat/>}/>
        <Route path='offerings' element={<Offerings/>}/>
       
        <Route path='*' element={<NotFound/>}/>

      </Routes>
      
       
       
      <Footer/>
    
     
    </BrowserRouter>
  );
}

export default App;
