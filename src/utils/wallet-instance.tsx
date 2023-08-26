import smartWallet from '../../Constants/SmartWallet.json';
import { ethers } from 'ethers';
export const walletInstance = async (address:string) => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, JSON.stringify(smartWallet), signer);
    return contract;
  }
};
