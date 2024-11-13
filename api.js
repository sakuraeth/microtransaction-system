import axios from 'axios';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const {
  CONTRACT_ADDRESS,
  INFURA_API_KEY,
  CONTRACT_ABI,
  WALLET_PRIVATE_KEY,
  WALLET_ADDRESS,
} = process.env;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`));
const contract = new web3.eth.Contract(JSON.parse(CONTRACT_ABI) as AbiItem[], CONTRACT_ADDRESS);

const getTransactionOptions = async (transaction) => {
    return {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({from: WALLET_ADDRESS}),
        gasPrice: await web3.eth.getGasPrice()
    };
};

const signAndSendTransaction = async (options) => {
    const signed = await web3.eth.accounts.signTransaction(options, WALLET_PRIVATE_KEY);
    return web3.eth.sendSignedTransaction(signed.rawTransaction);
};

const contractAPI = {
    processPayment: async (amount, toAddress) => {
        const transaction = contract.methods.transfer(toAddress, amount);
        const options = await getTransactionOptions(transaction);
        return signAndSendTransaction(options);
    },
    createUser: async (userName) => {
        const transaction = contract.methods.createUser(userName);
        const options = await getTransactionOptions(transaction);
        try {
            return await signAndSendTransaction(options);
        } catch (error) {
            throw error;
        }
    },
    getUserData: async (userId) => {
        return contract.methods.getUserData(userId).call();
    }
};

export default contractAPI;