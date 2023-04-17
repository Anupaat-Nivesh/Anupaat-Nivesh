import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Footer,About,Offerings, Whyanupaat,Home,FAQs,Privacypolicy,
  MutualFund,EquityBasket,LoanAgainstSecurities} from './containers';
import {NotFound,Contact,Navbar,OurApp} from './components' ;
import AOS from 'aos';
import 'aos/dist/aos.css';

import './App.css' ;
import ScrollToTop from './components/ScrollToTop';
AOS.init();

function App() {
 return (
  
    <BrowserRouter>
    <ScrollToTop/>
    <Navbar/>
  
      <Routes>
    
        <Route index element ={<Home/>}/>
        <Route path='home' element={<Home/>} />
        <Route path='about' element={<About/>}/>
        <Route path='whyanupaat' element={<Whyanupaat/>}/>
        <Route path='offerings' element={<Offerings/>}/>
        <Route path='contact' element={<Contact/>}/>
        <Route path='ourApp' element={<OurApp/>}/>
      
      <Route path='*' element={<NotFound/>}/>
        {/* footer pages  */}
      <Route path='faqs' element={<FAQs/>}/>
      
      <Route path='privacy-policy' element={<Privacypolicy/>}/>
      {/* Offering pages  */}
      <Route path='mutual-funds' element={<MutualFund/>}/>
      <Route path='equity-basket' element={<EquityBasket/>}/>
      <Route path='loan-against-securities' element={<LoanAgainstSecurities/>}/>




     
      

      </Routes>
      
     

    
       
      <Footer/>
    
     
    </BrowserRouter>
  );
}

export default App;
