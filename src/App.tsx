import './App.css';
import { useState } from 'react';
import { HeaderMenu } from './components/Header/Header';
import Main from './components/Main/Main';
import AddressContext from './context/AddressData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import Contracts from './components/Contracts/Contracts';

function App() {
  const [contractAddress, setContractAddress] = useState<string>('');

  return (
    <AddressContext.Provider value={{ contractAddress, setContractAddress }}>
      <HeaderMenu />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/contracts" element={<Contracts />} />
      </Routes>
      <ToastContainer />
    </AddressContext.Provider>
  );
}

export default App;
