import { useState } from 'react';
import { Box, Button, TextInput, Textarea } from '@mantine/core';
import smartFactory from '../../../Constants/SmartWalletFactory.json';
import contractAddress from '../../../Constants/contractAddersses.json';
import { ethers } from 'ethers';

interface Data {
  entryPoint: string;
  walletOwner: string;
  upgradeDelay: string;
}

const Main = () => {
  const [data, setData] = useState<Data>({
    entryPoint: '',
    walletOwner: '',
    upgradeDelay: '',
  });

  const createHandler = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress.SmartWalletFactory, JSON.stringify(smartFactory), signer);

        await contract.createSmartWallet(data.entryPoint, data.walletOwner, data.upgradeDelay);
        console.log('created');
        const address = await contract.getWalletAddress(data.entryPoint, data.walletOwner, data.upgradeDelay);
        console.log({ address });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      w={500}
      mx="auto"
      p={20}
      sx={{
        borderRadius: '10px',
        backgroundColor: '#fff',
      }}
    >
      <Box>
        <TextInput
          label="Entry Point Contract"
          placeholder=" Entry Point Contract here "
          withAsterisk
          my={20}
          value={data.entryPoint}
          onChange={(e) => setData((prev) => ({ ...prev, entryPoint: e.target.value }))}
        />
        <TextInput
          label="Wallet Owner"
          placeholder=" Wallet owner here "
          withAsterisk
          my={20}
          value={data.walletOwner}
          onChange={(e) => setData((prev) => ({ ...prev, walletOwner: e.target.value }))}
        />
        <TextInput
          label="Upgrade Delay"
          placeholder=" Upgrade Delay here "
          withAsterisk
          my={20}
          value={data.upgradeDelay}
          onChange={(e) => setData((prev) => ({ ...prev, upgradeDelay: e.target.value }))}
        />
        <Textarea />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={createHandler} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
          Create
        </Button>
        <Button onClick={createHandler} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
          Get Wallet Address
        </Button>
      </Box>
    </Box>
  );
};
export default Main;
