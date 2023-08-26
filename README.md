


# Smart Wallet : Simplifying User-Friendly Wallets with Enhanced Security
In the rapidly evolving landscape of blockchain technology, the Account Abstraction Project emerges as a pioneering solution to tackle the challenges of key management and user accessibility within the Ethereum ecosystem. Born from the desire to empower users, including those unfamiliar with intricate technicalities, this project reimagines the way users interact with Ethereum by introducing an innovative approach to wallet management.
### Purpose
At its core, the Account Abstraction Project was conceived to eradicate the complexities associated with key management while enabling even the least tech-savvy individuals to seamlessly navigate the world of cryptocurrency wallets. The primary objective was to create a user-centric solution that ensures robust security, simplified usability, and universal accessibility. This project addresses the prevalent issues of poor key handling and the need for users to maintain ETH balances for gas payments, paving the way for a more inclusive and user-friendly blockchain experience.
### Project Goals
The Account Abstraction Project sets its sights on a grand mission: to onboard billions of users to Ethereum while guaranteeing their security and fostering a sense of trust in the system. This ambitious goal is underpinned by a steadfast commitment to democratizing access to the Ethereum network, making it approachable for a diverse range of users spanning generations and technical backgrounds.
### How the Project Addresses the Challenge
The crux of the Account Abstraction Project lies in the ingenious utilization of smart contracts to abstract away the complexities of key management. By introducing a logic contract that leverages proxy mechanisms and deterministic addresses using the create2 opcode, the project ensures consistent addresses across multiple blockchain networks. This means that users can seamlessly transition between different chains while retaining a familiar and unchanging address.

Through this innovation, the project revolutionizes the way users interact with Ethereum. Smart contract wallets become the conduit for users to interface with the blockchain, enabling a multitude of benefits that were previously unattainable:

   - Enhanced Security: Users can define custom security rules, reducing the risk of unauthorized access to their accounts. Moreover, the ability to recover accounts in the event of lost keys adds an extra layer of security.

   - Convenience and Accessibility: The project's design empowers users to share their account security across trusted devices or individuals, promoting secure collaboration and account management.

   - Gas Efficiency: Users can seamlessly delegate gas payments, allowing them to cover transaction costs for others or have their fees sponsored by external parties.

   - Transaction Batching: The streamlined interface enables users to bundle multiple transactions into a single action, simplifying complex processes and reducing transaction clutter.

   - Innovation Potential: Developers now have an expanded canvas to create innovative dApps and wallet solutions that provide seamless user experiences, thanks to the improved support for smart contract wallets.
### Installation
To get started with the Account Abstraction Project and explore its innovative features, follow these simple installation steps. The project was developed using Hardhat and is hosted on GitHub for easy access.

   - Clone the Repository: Begin by cloning the project repository to your local machine using the following command:

```shell
git clone https://github.com/ARNO-0/Arbitrum_AA.git
```
- Navigate to the Project Directory: Move into the project directory using the cd command:

```shell
cd Arbitrum_AA
```
- Install Dependencies: Before you can start exploring the project, make sure to install its dependencies. Use the following command:
```shell
yarn install
```

# Usage

### SmartWalletFactory.sol Contract Usage Guide
    
The SmartWalletFactory contract is designed to facilitate the creation and management of smart wallets on the EVM based blockchains. It leverages the Create2 functionality to deploy deterministic instances(Proxy) of smart wallets and provides methods to interact with these wallets.

#### Deploying the SmartWalletFactory Contract

- To deploy the SmartWalletFactory contract, we'll need to provide a unique bytes32 salt value as an argument to its constructor. This salt value plays a crucial role in the deployment process of the implementation contract, which serves as the logic for proxies across various chains. By utilizing this salt during deployment, you ensure that the resulting implementation address remains consistent across different blockchain networks. This uniformity in implementation addresses facilitates seamless cross-chain interaction and synchronization.

#### Creating a New Smart Wallet
-  To create a new smart wallet, call the `createSmartWallet` function with the following parameters:

    - entryPoint: The address of the entry point contract.  EntryPoint is a singleton smart contract that handles the verification and execution logic for transactions..
    - walletOwner: The address that will own the new smart wallet.
    - upgradeDelay: The upgrade delay (in seconds) for the implementation contract.

- This function will deploy a new smart wallet instance using the provided parameters and emit an event with the address of the new smart wallet proxy.The created smart wallet will inherit the logic from the common implementation contract.
#### Getting the Address of a Smart Wallet
- Use the `getWalletAddress` function to compute the address of a new smart wallet without actually deploying it. Provide the same parameters as when creating a new smart wallet. This can be useful for verification purposes before deployment.

### SmartWalletProxy.sol Contract Usage Guide
- The `SmartWalletProxy` contract serves as a proxy for the SmartWallet implementation, allowing for upgradability and efficient interaction with the smart wallet logic.
- Ownership and Upgrades:

    - The contract owner has the exclusive ability to upgrade the implementation logic of the smart wallet. Use the `upgradeTo` function, providing the address of the new logic implementation.
- Calling Smart Wallet Logic:

    - The proxy facilitates seamless interaction with the underlying smart wallet logic. Calls to the proxy's functions are delegated to the current implementation, enabling operations like transferring assets, executing transactions, and more.    

### SmartWallet(Logic) Contract Usage Guide

The `SmartWallet` contract serves as the implementation logic for the smart wallet proxy. It contains a set of functions that allow users to interact with the contract, manage assets, execute transactions, and more. Additionally, the contract is designed to receive assets on multiple chains. Below is an overview of the key functionalities and how to use them:

### Transferring Tokens
- To transfer ERC20 tokens, use the `transferERC20` function by providing the following parameters:
    -  `token`: The address of the ERC20 token contract.
    -    `to`: The address to which tokens will be transferred.
     -   `amount`: The amount of tokens to transfer.

-    To transfer ETH, use the transferETH function by providing the following parameters:
       - `to`: The address to which ETH will be transferred.
       - `amount`: The amount of ETH to transfer.

-    To transfer ERC721 tokens, use the transferERC721 function by providing the following parameters:
       - `collection`: The address of the ERC721 token contract.
       - `tokenId`: The ID of the token to transfer.
       - `to`: The address to which the token will be transferred.

-    To transfer ERC1155 tokens, use the transferERC1155 function by providing the following parameters:
       - `collection`: The address of the ERC1155 token contract.
       - `tokenId`: The ID of the token to transfer.
       - `to`: The address to which tokens will be transferred.
       - `amount`: The amount of tokens to transfer.
### Recovery Wallet Management: `addRescueWallet` and `revokeRescueWallet` Functionality
- The `addRescueWallet` and `revokeRescueWallet` functions are designed to manage a list of recovery wallets that can be used to regain access to the smart wallet in case of emergencies. The `addRescueWallet` function allows the owner to add multiple recovery wallet addresses to the list, and the`revokeRescueWallet` function allows the owner to remove a specific recovery wallet address from the list. The recovery wallet list is intended to provide additional security and a way to regain control over the smart wallet when needed.

#### Adding Recovery Wallets (`addRescueWallet`)

The `addRescueWallet` function allows the owner to add recovery wallets to the list. To use this function:

  -  Call the `addRescueWallet` function with the following parameters:
       - `_recoveryWallets`: An array of addresses representing the recovery wallets to be added.
       - `threshold`: A uint16 value indicating the minimum number of recovery wallets required to regain access.

#### Revoking Recovery Wallets (`revokeRescueWallet`)

The `revokeRescueWallet` function allows the owner to remove a recovery wallet from the list. To use this function:

  -  Call the `revokeRescueWallet` function with the following parameters:
      -  `_recoveryWallet`: The address of the recovery wallet to be removed.
      -  `threshold`: A uint16 value indicating the minimum number of recovery wallets required to regain access.
### EntryPoint Address Configuration
- The `setEntryPointAddress` function allows the owner of the smart wallet to update the address of the associated `EntryPoint` contract. The `EntryPoint` contract is responsible for handling the verification and execution logic for transactions. This function enables the owner to reconfigure the smart wallet to interact with a new instance of the `EntryPoint` contract, providing flexibility and adaptability to changes in the underlying logic.     
- To change the EntryPoint address, call the `setEntryPointAddress` function with the following parameter:

   - `_newEntryPointAddress`: The new address of the EntryPoint contract that the smart wallet will interact with.


### Ownership Management

   - Transfer ownership of the smart wallet using the `transferOwnership` function by providing the new owner's address.   
### Flexible Transaction Execution: execute and executeBatch Functions

- The `execute` and `executeBatch` functions provide a versatile way for the smart wallet owner or the designated entry point contract to execute transactions. These functions allow transactions to be performed on both external contracts and the smart wallet contract itself, enhancing the smart wallet's utility and flexibility.

#### `execute` Function:

The `execute` function is accessible to both the owner and the designated entry point contract, enabling them to initiate transactions on external contracts or the smart wallet contract.
- Call the `execute` function with the following parameters:
     -  `_target`: The address of the target contract. It can be an external contract or the smart wallet contract itself.
    -  `_value`: The amount of ETH to include in the transaction.
    - `_data`: The transaction data to execute on the target contract.

#### `executeBatch` Function:

The `executeBatch` function enables the owner or the designated entry point contract to execute a batch of transactions on external contracts or the smart wallet contract.



   - Call the executeBatch function with arrays of the following parameters:
       - `_target`: An array of target contract addresses or the smart wallet's address.
       - `_value`: An array of ETH values to be sent with each transaction.
      -  `_data`: An array of transaction data to execute on each target contract.    

### Validating and Processing User Operations: `validateUserOps` Function

The `validateUserOps` function is a crucial element of the Ethereum Improvement Proposal (EIP) 4337, designed to verify and execute User Operations within the context of Account Abstraction Using Alt Mempool. This function is intended to be called exclusively by the singleton entrypoint contract, ensuring the integrity of transactions, managing necessary fund deposits for transaction fees, and verifying the user's signature.


### Managing Gas Fee Funds in EntryPoint Contract
`getDeposite()`

- The getDeposite() function retrieves the current deposit amount held by the smart wallet in the EntryPoint contract. This deposit serves as a fund that can be used to cover gas fees for gasless transactions initiated by the smart wallet.
`addDeposite()`

- The addDeposite() function allows the owner of the smart wallet to add additional funds to the deposit held in the EntryPoint contract. These added funds can be utilized to facilitate gasless transactions, ensuring that the smart wallet can cover the associated gas costs effectively.

`withdrawDepositeTo()`
 - The withdrawDepositeTo function enables the owner of the smart wallet to withdraw funds from the gas fee deposit held within the EntryPoint contract. This function facilitates the withdrawal of a specified amount of funds to the designated recipient address.
-  To withdraw gas fee funds from the wallet's deposit in the EntryPoint contract, follow these steps:

    - Call the `withdrawDepositeTo` function with the following parameters:
       - `to`: The recipient's address to which the funds will be transferred.
       - `amount`: The amount of funds to be withdrawn.

    The function will perform an external call to the EntryPoint contract using the provided parameters.

### Additional Functions

To retrieve essential information from the smart wallet, you can use the following functions:

`entryPoint()`

- The entryPoint() function allows you to get the address of the entry point contract associated with the smart wallet. This contract serves as the primary interaction point for the smart wallet's functionality.

`nonce()`

- The nonce() function enables you to obtain the current nonce value associated with the smart wallet. The nonce is used to track and manage user operations and transactions.

`owner()`

- The owner() function lets you retrieve the address of the owner of the smart wallet. The owner has the authority to manage and control the smart wallet's functionalities.

# Key Features

Experience the robust feature set that the SmartWallet contract brings to the table, elevating the efficiency and versatility of your smart wallet solution:

   - Gas Fee Management: Seamlessly oversee gas fee requirements for gasless transactions by upholding a dedicated deposit within the EntryPoint contract.


   - Precise Transaction Execution: Execute transactions effortlessly to engage with diverse contracts on the blockchain, seamlessly integrating with decentralized applications (dApps).

   - ERC1155 Token Transfer: Effortlessly transfer ERC1155 tokens to designated addresses, streamlining the exchange and interaction with non-fungible tokens (NFTs).

   - Ownership Authority: Maintain command over the smart wallet's ownership, enabling designated owners to govern and supervise wallet functionalities with precision.

   - Nonce Monitoring: Keep meticulous tabs on nonces for systematic management of user operations and meticulous transaction sequencing.

  
   - Gasless Transaction Empowerment: Enable the execution of gasless transactions by judiciously deploying the deposited funds to defray gas fees, optimizing the user transaction experience.

  

  -  Smart Contract Evolution: Initiate smart contract upgrades while retaining unwavering ownership and mastery over the wallet's operational dynamics.

   - ERC721 Token Facilitation: Facilitate seamless ERC721 token transfers to designated recipients, enabling swift and smooth exchange of distinct tokens.

These meticulously curated features collectively empower the SmartWallet contract to emerge as a versatile, sophisticated, and user-centric solution tailored to the intricacies of transaction management, asset governance, and gas fee optimization within the blockchain ecosystem.

# Deployed Contract Addresses

#### SmartWalletFactory Contract Address
- [sepolia](https://sepolia.etherscan.io/address/0xe65cdb885918b47fbd516061dac42ce976cd28bd)
- [avalanche testnet](https://testnet.snowtrace.io/address/0x1206f86bfbc37e3a2f87a85865bccb18c1d19b86)
- [Arbitrum testnet]()
#### SmartWallet Contract Addresses
- [sepolia](https://sepolia.etherscan.io/address/0x46c0C0bf6A37314D009f3AD736c20feBF396a92B)
- [avalanche testnet](https://testnet.snowtrace.io/address/0x61fde233a97397b060580b8217ffd3395d3b62db)
- [Arbitrum testnet]()