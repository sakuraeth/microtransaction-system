import axios from 'axios';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const CONTRACT_ABI = JSON.parse(process.env.CONTRACT_ABI);
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`));
const contract = new web3.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS);
const contractAPI = {
    processPayment: async (amount, toAddress) => {
        const transaction = contract.methods.transfer(toAddress, amount);
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({from: WALLET_ADDRESS}),
            gasPrice: await web3.eth.getGasPrice()
        };
        const signed = await web3.eth.accounts.signTransaction(options, WALLET_PRIVATE_KEY);
        return web3.eth.sendSignedTransaction(signed.rawTransaction);
    },
    createUser: async (userName) => {
        const transaction = contract.methods.createUser(userName);
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({from: WALLET_ADDRESS}),
            gasPrice: await web3.eth.getGasPrice()
        };
        const signed = await web3.eth.accounts.signTransaction(options, WALLET_PRIVATE_KEY);
        return web3.eth.sendSignedTransaction(signed.rawTransaction).then(receipt => {
            return receipt;
        }).catch(error => {
            throw error;
        });
    },
    getUserData: async (userId) => {
        return contract.methods.getUserData(userId).call();
    }
};
export default contractAPI;