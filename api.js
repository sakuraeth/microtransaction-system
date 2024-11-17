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
    const batch = new web3.BatchRequest();
    
    const gasEstimatePromise = new Promise((resolve, reject) => {
        batch.add(web3.eth.estimateGas.request(
            {from: WALLET_ADDRESS, to: transaction._parent._address, data: transaction.encodeABI()},
            (error, gas) => error ? reject(error) : resolve(gas)
        ));
    });

    const gasPricePromise = new Promise((resolve, reject) => {
        batch.add(web3.eth.getGasPrice.request(
            {},
            (error, gasPrice) => error ? reject(error) : resolve(gasPrice)
        ));
    });

    batch.execute();

    const [gas, gasPrice] = await Promise.all([gasEstimatePromise, gasPricePromise]);

    return {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas,
        gasPrice
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
        // Read operation can potentially be optimized with batching if there are multiple reads to be performed together
        return contract.methods.getUserData(userId).call();
    }
};

export default contractAPI;