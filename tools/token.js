const config = require("../config.json")

class Token {
    constructor({ symbol, address, decimals } = {}) {
        if (!symbol || !address) throw new Error(`Symbol or address are invalid on reward token! Got symbol: ${symbol}, address: ${address}.`)

        this._symbol = symbol
        this._address = address
        this._decimals = decimals
    }

    get symbol() {
        return this._symbol
    }

    get address() {
        return this._address
    }

    get decimals(){
        return this._decimals
    }
}

module.exports = new Token(config.token)