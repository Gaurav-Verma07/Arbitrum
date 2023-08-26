import React, { useContext, useEffect, useState } from 'react';
import { Box, Navbar, createStyles, getStylesRef, rem } from '@mantine/core';
import AddressContext from '../../context/AddressData';
import { walletInstance } from '../../utils/wallet-instance';

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
  const [active, setActive] = useState('Billing');

  useEffect(() => {
    walletInstance().then((wallet) => {
      console.log({ wallet });
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
  console.log(contractAddress);
  return (
    <React.Fragment>
      <Navbar height="100vh" width={{ sm: 300 }} p="md">
        <Navbar.Section grow>{links}</Navbar.Section>
      </Navbar>
      <Box></Box>
    </React.Fragment>
  );
};
export default Contracts;
