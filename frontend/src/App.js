import React, { useState } from 'react';
import Navbar from './navbar';
import ImageProcessing from './components/image_processing'

const App= ()=> {
  
  return (
    <div>
      <Navbar/>
      <ImageProcessing/>
    </div>
  );
}

export default App;
