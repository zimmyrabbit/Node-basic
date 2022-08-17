import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  //Link
  } from "react-router-dom";
  
  import LandingPage from './components/views/LandingPage/LandingPage'
  import LoginPage from './components/views/LoginPage/LoginPage'
  import RegisterPage from './components/views/RegisterPage/RegisterPage'
  import Auth from './hoc/auth';
  //Auth(LandingPage, null)
  //Auth(LoginPage, false)
  //Auth(RegisterPage, false)
  function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element = {<LandingPage/>}/> 
          <Route exact path="/login" element = {<LoginPage/>}/>
          <Route exact path="/register" element = {<RegisterPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
  
  }

export default App;

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}