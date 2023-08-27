import React from 'react';
import logo from './img/Logo.png';
import './index.css';
const Header = () => {
  return (
    <header>
    <img src={logo} alt="" />
    <h1>Image Annotation Tool</h1>
    </header>

  )
}

export default Header
