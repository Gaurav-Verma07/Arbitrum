import smartWallet from '../../Constants/SmartWallet.json';
import contractAddress from '../../Constants/contractAddersses.json';
import { ethers } from 'ethers';
export const walletInstance = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress.SmartWalletFactory, JSON.stringify(smartWallet), signer);
    return contract;
  }
};
