
const { network, networks } = require("../config.json")

if (!network) {
    throw new Error(`Network is not set in the config file!`)
}

if (!networks[network]) {
    throw new Error(`Network is not in networks config!`)
}

class Network {
    constructor({ name, explorer, rpc, hmyId, chainId } = {}) {

        const not_found = []
        if(!name) not_found.push(`name`)
        if(!explorer) not_found.push(`explorer`)
        if(!rpc) not_found.push(`rpc`)
        if(!hmyId) not_found.push(`hmyId`)
        if(!chainId) not_found.push(`chainId`)

        if(not_found.length > 0) throw new Error(`Could not create network, as one or more values are missing: ${not_found.join(",")}`)

        this._name = name
        this._explorer = explorer
        this._rpc = rpc
        this._hmyId = hmyId
        this._chainId = chainId
    }

    get name() {
        return this._name
    }

    get explorer() {
        return this._explorer
    }

    get rpc() {
        return this._rpc
    }

    get chainId(){
        return this._chainId
    }

    get hmyId(){
        return this._hmyId
    }
}

module.exports = new Network(networks[network])