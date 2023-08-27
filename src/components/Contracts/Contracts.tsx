/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Loader,
  Navbar,
  Text,
  TextInput,
  Tooltip,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import AddressContext from "../../context/AddressData";
import { walletInstance } from "../../utils/wallet-instance";
import { toast } from "react-toastify";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useClipboard } from "@mantine/hooks";
import { data } from "./data";
import { ethers } from "ethers";

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

const Contracts = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("entryPoint");
  const [wallet, setWallet] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { contractAddress } = useContext(AddressContext);
  const [walletAddress, setWalletAddress] = useState<string>(contractAddress);
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>({});
  const [threshold, setThreshold] = useState<string>("");
  const [data256, setData256] = useState<string>("");
  const clipboard = useClipboard();

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));

  const generateHandler = async () => {
    try {
      setIsLoading(true);
      if (active === "Create Wallet") {
        walletInstance(walletAddress).then((wallet) => {
          setWallet(wallet);
          setIsWalletCreated(true);
          console.log(wallet);
          toast.info("wallet created successfully");
        });
      }
      if (active === "Entry Point") {
        console.log(wallet);
        wallet.entryPoint().then((data: string) => {
          console.log({ data });
          setResultData((prev: any) => ({ ...prev, entryPoint: data }));
        });
      }
      if (active === "Get Deposite") {
        wallet.getDeposite().then((data: any) => {
          console.log({ data });
          setResultData((prev: any) => ({ ...prev, getDeposite: data }));
        });
      }
      if (active === "Add Deposite") {
        const userInputInWei = ethers.utils.parseEther(data256);
        wallet.addDeposite({ value: userInputInWei }).then((data: any) => {
          console.log({ data });
          setResultData((prev: any) => ({
            ...prev,
            addDeposite: "Transaction successful!!!",
          }));
          toast.info("Transaction successful");
        });
      }
      if (active == "Add Rescue Wallet") {
        wallet.addRescueWallet([walletAddress], threshold).then((data: any) => {
          console.log({ data });
          setResultData((prev: any) => ({
            ...prev,
            addRescueWallet: "Transaction successful!!!",
          }));
          toast.info("Transaction successful");
        });
      }
      if (active === "Set EntryPoint Address") {
        wallet.setEntryPointAdress(walletAddress).then((data: any) => {
          console.log({ data });
          setResultData((prev: any) => ({
            ...prev,
            setEntryPointAdress: "Transaction successful!!!",
          }));
          toast.info("Transaction successful");
        });
      }
      if (active === "Execute") {
        const userInputwei = ethers.utils.parseEther(threshold);
        wallet
          .execute(walletAddress, userInputwei, data256)
          .then((data: any) => {
            console.log({ data });
          });
      }
      if (active === "Revoke Rescue Wallet") {
        wallet
          .revokeRescueWallet(walletAddress, threshold)
          .then((data: any) => {
            console.log({ data });
          });
      }
      if (active === "Transfer ETH") {
        const userInputwei = ethers.utils.parseEther(data256);
        wallet.transferETH(walletAddress, userInputwei).then((data: any) => {
          console.log({ data });
        });
      }
      if (active === "Transfer Ownership") {
        wallet.transferOwnership(walletAddress).then((data: any) => {
          console.log({ data });
          setResultData((prev: any) => ({
            ...prev,
            transferOwnership: "Transaction successful!!!",
          }));
          toast.info("Transaction successful");
        });
      }
      console.log(resultData);
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar
        height="100%"
        width={{ sm: 300 }}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}
        p="md"
      >
        <Navbar.Section grow>{links}</Navbar.Section>
      </Navbar>
      <Box
        sx={{
          alignSelf: "center",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Box w={400}>
          {active !== "Get Deposite" && active !== "Entry Point" && (
            <TextInput
              my={20}
              value={walletAddress}
              defaultValue={walletAddress}
              onChange={(e: any) => setWalletAddress(e.target.value)}
              label="Contract Address"
              placeholder={
                active == "Add Deposite"
                  ? "How much you wanna deposit into an entry Contract?"
                  : "Enter address here"
              }
              description={
                active === "Create Wallet"
                  ? "*Enter new contract address or continue with generated one"
                  : ""
              }
            />
          )}
          {(active === "Add Rescue Wallet" ||
            active === "Revoke Rescue Wallet" ||
            active === "Execute") && (
            <TextInput
              my={20}
              value={threshold}
              defaultValue={threshold}
              onChange={(e: any) => setThreshold(e.target.value)}
              label={active === "Execute" ? "Value" : "Threshold"}
              placeholder={
                active === "Execute"
                  ? "Enter value here"
                  : "Enter threshold here"
              }
            />
          )}
          {(active === "Execute" || active === "Transfer ETH") && (
            <TextInput
              my={20}
              label={active === "Transfer ETH" ? "Amount" : "Data"}
              value={data256}
              onChange={(e: any) => setData256(e.target.value)}
              placeholder={
                active === "Transfer ETH"
                  ? "Enter amount here"
                  : "Enter data here"
              }
            />
          )}

          {active !== "Entry Point" && (
            <Button
              sx={{ justifySelf: "flex-end" }}
              onClick={generateHandler}
              disabled={
                walletAddress === "" ||
                (active !== "Create Wallet" && !isWalletCreated)
              }
            >
              {isLoading ? (
                <Loader variant="dots" color="#fff" />
              ) : active === "Create Wallet" ? (
                "Create  Wallet"
              ) : (
                active
              )}
            </Button>
          )}

          {resultData?.[active] &&
            (active === "Add Deposite" ||
            active === "Add Rescue Wallet" ||
            active === "Set EntryPoint Address" ||
            active === "Transfer Ownership" ? (
              <Text color="grey"> {resultData?.[active]} </Text>
            ) : (
              <Box mt={20} maw={500} mx="auto">
                <Text color="grey" mb={15}>
                  {active}:{" "}
                </Text>
                <Tooltip
                  label={`${active} copied!`}
                  offset={5}
                  position="bottom"
                  radius="xl"
                  transitionProps={{ duration: 100, transition: "slide-down" }}
                  opened={clipboard.copied}
                >
                  <Button
                    variant="light"
                    rightIcon={
                      clipboard.copied ? (
                        <IconCheck size="1.2rem" stroke={1.5} />
                      ) : (
                        <IconCopy size="1.2rem" stroke={1.5} />
                      )
                    }
                    radius="xl"
                    size="md"
                    styles={{
                      root: { paddingRight: rem(14), height: rem(48) },
                      rightIcon: { marginLeft: rem(22) },
                    }}
                    onClick={() => clipboard.copy(resultData?.[active])}
                  >
                    {resultData?.[active]}
                  </Button>
                </Tooltip>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
export default Contracts;
