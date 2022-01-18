const { ethers } = require("ethers")
const network = require("./network")


const getProvider = function () {
    return new ethers.providers.JsonRpcProvider(network.rpc, {
        name: network.name,
        chainId: network.chainId
    })
}

const getWallet = function (privateKey) {
    const provider = getProvider()
    return new ethers.Wallet(privateKey, provider)
}

module.exports = {
    getWallet,
    getProvider
}