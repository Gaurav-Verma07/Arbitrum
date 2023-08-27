const { ethers } = require("hardhat");
const { randomBytes } = require("node:crypto");
const { verify } = require("../utils/verify");
const { keccak256 } = require("@ethersproject/keccak256");

module.exports = async () => {
  const randomUser = "0xd0193dabcCf32426D249419f141c611e059A0158";
  // // Deploy WalletFactory contract
  const signer = await ethers.getSigner(
    "0x5AfB232040bb6c734486B28837AC1eE78Bae0A1A"
  );
  console.log("signer:", signer.address);
  const WalletFactory = await ethers.getContractFactory(
    "SmartWalletFactory",
    signer
  );
  const keccakHash = keccak256("0x5AfB232040bb6c734486B28837AC1eE78Bae0A1A");

  const walletFactoryInstance = await WalletFactory.deploy(keccakHash);
  await walletFactoryInstance.waitForDeployment(12); // Await deployment confirmation
  console.log("WalletFactory deployed to:", walletFactoryInstance.target);
  // wait 1 minute for etherscan to index the contract
  await new Promise((resolve) => setTimeout(resolve, 60000));
  //////////////////////////////////////////////
  await verify(walletFactoryInstance.target, [keccakHash]);
  ///////////////////////////////////////////////
  // now we verify the implementation contract
  const implementationAddress = await walletFactoryInstance.walletLogic();
  console.log("implementationAddress:", implementationAddress);
  // wait 1 minute for etherscan to index the contract
  await new Promise((resolve) => setTimeout(resolve, 60000));
  ////////////////////////////////////////////////
  await verify(implementationAddress);
  ////////////////////////////////////////////////

  const SmartWalletFactoryInstace = await ethers.getContractAt(
    "SmartWalletFactory",
    walletFactoryInstance.target,
    signer
  );

  const upgradeDelay = 172800;
  const proxy = await SmartWalletFactoryInstace.createSmartWallet(
    randomUser,
    signer.address,
    upgradeDelay
  );
  await proxy.wait(6);
  // check events logs to determine proxy address
  const txHash = proxy.hash;
  const receipt = await ethers.provider.getTransactionReceipt(txHash);

  const proxyContract = "0x" + receipt.logs[1].topics[1].slice(26); // Removes the leading zeros

  console.log("proxy deployed to:", proxyContract);

  // now we verify the proxy contract
  // Assuming these are the values for your function parameters
  const entryPoint = randomUser; // Entry point address
  const walletOwner = signer.address; // Wallet owner address
  // Get the function selector for the initialize function
  // Construct the function signature

  const functionSelector = keccak256(
    ethers.toUtf8Bytes("initialize(address,address,uint32)")
  ).slice(0, 10);

  // Encode the parameters using the defaultAbiCoder
  const encodedParameters = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint32"],
    [entryPoint, walletOwner, upgradeDelay]
  );
  // Construct the full data for the function call
  const data = functionSelector + encodedParameters.slice(2); // Remove the "0x" prefix
  console.log("Encoded data:", data);
  // // wait 1 minute for etherscan to index the contract
  await new Promise((resolve) => setTimeout(resolve, 60000));
  //////////////////////////////////////////////////////////

  await verify(proxyContract, [implementationAddress, data, walletOwner]);
  //////////////////////////////////////////////////////////
};
