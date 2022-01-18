const { Harmony } = require('@harmony-js/core');
const { getAddressFromPrivateKey } = require('@harmony-js/crypto');
const { Account } = require('@harmony-js/account');

const { ChainType, hexToNumber, fromWei, Units, Unit } = require('@harmony-js/utils');
const network = require('./network');
const token = require('./token');
const { formatUnits } = require('ethers/lib/utils');
const { getWallet, getProvider } = require('./wallet');
const { utils, ethers } = require('ethers');
const erc20Abi = require("../abi/erc20.json");

module.exports = {


    sendToken: async (privateKeyFrom, sendToAddress, amount) => {
        const wallet = getWallet(privateKeyFrom)
        const tokenContract = await new ethers.Contract(token.address, erc20Abi, wallet)
        const weiAmount = utils.parseUnits(amount.toString(), token.decimals)
        return tokenContract.transfer(sendToAddress, weiAmount)
    },

    getBalance: async (privateKey) => {
        const tokenContract = new ethers.Contract(token.address, erc20Abi, getProvider())
        const address = getAddressFromPrivateKey(privateKey)
        let balance = await tokenContract
            .balanceOf(address)

        return formatUnits(balance, token.decimals)
    },

    getOneBalance: (privateKey) => {
        const hmy = new Harmony(
            network.rpc,
            {
                chainType: ChainType.Harmony,
                chainId: network.hmyId,
            },
        );

        return hmy.blockchain
            .getBalance({ address: getAddressFromPrivateKey(privateKey) })
            .then((response) => fromWei(hexToNumber(response.result), Units.one))
            .catch(function (error) {
                console.error(error);
                return null;
            });
    },

    sendTransaction: async (privateKeyFrom, sendToAddress, amount) => {
        const hmy = new Harmony(
            network.rpc,
            {
                chainType: ChainType.Harmony,
                chainId: network.hmyId,
            },
        );

        hmy.wallet.addByPrivateKey(privateKeyFrom);

        const txn = hmy.transactions.newTx({
            to: sendToAddress,
            value: new Unit(amount).asOne().toWei(),
            gasLimit: '21000',
            shardID: 0,
            toShardID: 0,
            gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
        });

        const signedTxn = await hmy.wallet.signTransaction(txn);
        const txnHash = await hmy.blockchain.sendTransaction(signedTxn);
        return txnHash;
    },

    getAddress: (privateKey) => new Account(privateKey).bech32Address
}