const Discord = require('discord.js');
// const db = require('quick.db');
const BanWordUtils = require('../utils/banwordUtils.js');
const config = require('../config.json');

class profanityActions {
	static async checkForProfanity(client, message) {
		// const bannedWords = await db.get(`bannedWords-${message.guild.id}`);
		const bannedWordsSQL = await BanWordUtils.getBannedWords();

		// check that moderation channelID is valid before attempting profanity check
		if (client.channels.cache.get(config.channels.moderation) === undefined) {
			console.log('Error! Moderation Channel ID in Config in likely invalid. Please verify!');
		} else if (!bannedWordsSQL) { // ensure bannedWords is populated
			console.log('Error: No banned words found in database.');
		}

		if (bannedWordsSQL.some((word) => message.content.includes(word))) {
			const embedMessage = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTitle('🚩 Warning: Profanity detected 🚩')
				.setDescription(`Profanity detected in ${message.channel}`)
				.addField('User', message.author, true)
				.addField('Link', `[Go to message](${message.url})`, true)
				.addField('Message', `**${message.content}**`, true)
				.setFooter(
					`${message.author.username}#${message.author.discriminator}`,
					message.author.avatarURL,
				);
			return client.channels.cache
				.get(config.channels.moderation)
				.send(embedMessage);
		}
		return null;
	}
}

module.exports = profanityActions;
