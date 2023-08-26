import './App.css';
import { useState } from 'react';
import { HeaderMenu } from './components/Header/Header';
import Main from './components/Main/Main';
import AddressContext from './context/AddressData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  const [contractAddress, setContractAddress] = useState<string>('');

  return (
    <AddressContext.Provider value={{ contractAddress, setContractAddress }}>
      <HeaderMenu />
      <Main />
      <ToastContainer/>
    </AddressContext.Provider>
  );
}

export default App;
