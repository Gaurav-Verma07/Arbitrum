/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Navbar, TextInput, createStyles, getStylesRef, rem } from '@mantine/core';
import AddressContext from '../../context/AddressData';
import { walletInstance } from '../../utils/wallet-instance';
import { toast } from 'react-toastify';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const data = [
  { link: 'entryPoint', label: 'entryPoint' },
  { link: 'getDeposite', label: 'getDeposite' },
  { link: 'addDeposite', label: 'addDeposite' },
  { link: 'addRescueWallett', label: 'addRescueWallet' },
  { link: 'seeEntryPointAddress', label: 'seeEntryPointAddress' },
  { link: 'execute', label: 'execute' },
  { link: 'revokeRescueWallet', label: 'revokeRescueWallet' },
  { link: 'setEntryPointAddress', label: 'setEntryPointAddress' },
  { link: 'transferETH', label: 'transferETH' },
  { link: 'transferOwnerShip', label: 'transferOwnerShip' },
];

const Contracts = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('entryPoint');
  const [wallet, setWallet]= useState<any>();

  useEffect(() => {
    walletInstance(contractAddress).then((wallet) => {
        setWallet(wallet);
    });
  }, []);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));

  const { contractAddress } = useContext(AddressContext);

  const generateHandler= ()=>{
    try{

        if(active=='entryPoint'){
        console.log(wallet)    
            wallet.entryPoint().then((data:string)=>{
                console.log({data})
            })
        }
    }catch(err: any){
        toast.error(err.message)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar height="100%" width={{ sm: 300 }} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }} p="md">
        <Navbar.Section grow>{links}</Navbar.Section>
      </Navbar>
      <Box
        sx={{
          alignSelf: 'center',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box w={400}>
          <TextInput my={20} defaultValue={contractAddress} label="Contract Address" placeholder="Enter address here" />
          <Button sx={{ justifySelf: 'flex-end' }} onClick= {generateHandler} >Generate</Button>
        </Box>
      </Box>
    </Box>
  );
};
export default Contracts;
