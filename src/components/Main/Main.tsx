/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Loader, Text, TextInput, Tooltip, rem } from '@mantine/core';
import { contractInstance } from '../../utils/contract-instance';
import { toast } from 'react-toastify';
import AddressContext from '../../context/AddressData';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom'

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
  const [contractAdd, setContractAdd] = useState<any>();
  const [isLoading, setIsLoading] = useState({ load: false, method: '' });
  const { setContractAddress, contractAddress } = useContext(AddressContext);
  const clipboard = useClipboard();
  const navigate= useNavigate();

  useEffect(() => {
    contractInstance()
      .then((data: any) => {
        console.log(data);
        setContractAdd(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createHandler = async () => {
    try {
      setIsLoading({ load: true, method: 'CREATE' });
      if (typeof window.ethereum !== 'undefined') {
        await contractAdd.createSmartWallet(data.entryPoint, data.walletOwner, data.upgradeDelay);
        toast.info('Contract Address Created');
        setIsLoading({ load: false, method: '' });
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading({ load: false, method: '' });
    }
  };

  const getHandler = async () => {
    try {
      setIsLoading({ load: true, method: 'GET' });
      const address = await contractAdd.getWalletAddress(data.entryPoint, data.walletOwner, data.upgradeDelay);
      setContractAddress(address);
      toast.info('contract address generated');
      setIsLoading({ load: false, method: '' });
    } catch (err: any) {
      toast.error(err.message);
      setIsLoading({ load: false, method: '' });
    }
  };

  return (
    <Box>
      <Box
        maw={500}
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
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={createHandler} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            {isLoading.load && isLoading.method === 'CREATE' ? <Loader variant="dots" color="#fff" /> : 'Create'}
          </Button>
          <Button onClick={getHandler} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            {isLoading.load && isLoading.method === 'GET' ? (
              <Loader variant="dots" color="#fff" />
            ) : (
              'Get Wallet Address'
            )}
          </Button>
        </Box>
      </Box>
      {contractAddress && (
        <Box mt={20} maw={500} mx="auto">
          <Text color='grey' >Your Generated contract address: </Text>
          <Tooltip
            label="Address copied!"
            offset={5}
            position="bottom"
            radius="xl"
            transitionProps={{ duration: 100, transition: 'slide-down' }}
            opened={clipboard.copied}
          >
            <Button
              variant="light"
              rightIcon={
                clipboard.copied ? <IconCheck size="1.2rem" stroke={1.5} /> : <IconCopy size="1.2rem" stroke={1.5} />
              }
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: rem(14), height: rem(48) },
                rightIcon: { marginLeft: rem(22) },
              }}
              onClick={() => clipboard.copy(contractAddress)}
            >
              {contractAddress}
            </Button>
          </Tooltip>
          <Button onClick= {()=>{navigate('/contracts')}} >Go to Contracts</Button>
        </Box>
      )}
    </Box>
  );
};
export default Main;
