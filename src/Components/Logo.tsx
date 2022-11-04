import React from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const Logo = () => {
  return (
    <Link
      to="/"
      className="absolute top-[1.5rem] left-[1.5rem] flex items-center text-md text-cyan [text-decoration:none] sm:text-lg"
    >
      <img src={logoSvg} alt="CryptoBunks" />
      <span>CryptoBucks</span>
    </Link>
  );
};

export default Logo;
