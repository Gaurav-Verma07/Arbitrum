/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction } from 'react';

export interface AddressProp {
  contractAddress: string;
  setContractAddress: Dispatch<SetStateAction<AddressProp['contractAddress']>>;
}

const AddressContext = React.createContext<AddressProp>({
  contractAddress: '',
  setContractAddress: () => {},
});

export default AddressContext;
