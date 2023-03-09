import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Footer,About,Offerings, Whyanupaat,Home} from './containers';
import { Team, Brand ,Navbar,NotFound,Contact} from './components' ;
import OurApp from './components/OurApp/OurApp';
import './App.css' ;
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route index element ={<Home/>}/>
        <Route path='home' element={<Home/>} />
        <Route path='about' element={<About/>}/>
        <Route path='whyanupaat' element={<Whyanupaat/>}/>
<<<<<<< HEAD
        <Route path='offerings' element={<Offerings/>}/>
        <Route path='contact' element={<Contact/>}/>
=======
        <Route path='offerings' element={<Offerings/>}/>     
>>>>>>> 0fc80be3f6504291286b2cdfd7d11b4ab58025a4
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      
<<<<<<< HEAD
       
=======
       <Contact/>
       <OurApp />
>>>>>>> 0fc80be3f6504291286b2cdfd7d11b4ab58025a4
       
      <Footer/>
    
     
    </BrowserRouter>
  );
}

export default App;
