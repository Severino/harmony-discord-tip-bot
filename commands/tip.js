const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getAddress, sendToken } = require('../tools/harmony-util');
const network = require('../tools/network');
const token = require('../tools/token');
const { getAddressFromPrivateKey } = require('@harmony-js/crypto');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tip')
        .setDescription(`Tip the user a given amount of $${token.symbol}`)
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription(`Amount of $${token.symbol} to tip`).setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Working on it...');

        const amount = interaction.options.getNumber('amount');

        if (amount < 0.1 || amount > 100) {
            return interaction.editReply(`The amount must be between 0.1 and 100 $${token.symbol}`);
        }

        const receivingUser = interaction.options.getUser('user');

        if (receivingUser.id == interaction.user.id) {
            return interaction.editReply('Unable to send a tip to yourself');
        }

        var receiverPrivateKey = await getWalletPrivateKey(receivingUser.id);
        var senderPrivateKey = await getWalletPrivateKey(interaction.user.id);

        if (receiverPrivateKey == null || senderPrivateKey == null) {
            return interaction.editReply('Error retrieving wallet information');
        }

        var toAddress = getAddressFromPrivateKey(receiverPrivateKey)
        var senderBalance = await getBalance(senderPrivateKey);

        if (senderBalance < amount) {
            return interaction.editReply(`Insufficient balance. Current balance: \`${senderBalance}\` $${token.symbol}`)
        }

        let transaction
        try {
            transaction = await sendToken(senderPrivateKey, toAddress, amount)
        } catch (e) {
            console.log(e)
            return interaction.editReply(`Could not send token, maybe your one balance is too low?`)
        }

        console.log(receivingUser)

        return interaction.editReply(
            `Your tip of \`${amount}\` $${token.symbol} to ${receivingUser} was successful. \nTransaction details can be found [HERE](<${network.explorer}/tx/${transaction.result}>)`);
    },
};