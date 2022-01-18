const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, getAddress, getOneBalance } = require('../tools/harmony-util');
const token = require('../tools/token');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Retrieve balance of $ONE in your tip jar'),
    async execute(interaction) {
        await interaction.reply({content: 'Retrieving balance...', ephemeral: true });

        var walletPrivateKey = await getWalletPrivateKey(interaction.user.id);
        if (walletPrivateKey == null) {
            await interaction.editReply('Error retrieving wallet information');
        }

        var balance = await getBalance(walletPrivateKey);
        if (balance == null){
            return interaction.editReply('Error retrieving token balance');
        }

        var oneBalance = await getOneBalance(walletPrivateKey)
        if (balance == null){
            return interaction.editReply('Error retrieving one balance');
        }

        var address = getAddress(walletPrivateKey);

        return interaction.editReply(`Address: \`${address}\`\n${token.symbol} Balance: \`${balance}\`\nOne Balance: \`${oneBalance}\` $ONE`);
    }
};