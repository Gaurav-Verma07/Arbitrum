import { useContext } from 'react';
import { Box } from '@mantine/core';
import AddressContext from '../../context/AddressData';

const Contracts = () => {
  const { contractAddress } = useContext(AddressContext);
  return <Box>{contractAddress}</Box>;
};
export default Contracts;
