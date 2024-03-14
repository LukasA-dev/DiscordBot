const { EmbedBuilder } = require("discord.js");
const { fetchChampionData } = require("../bingo_utils/masteryToken");
const { getEmojiString } = require("../bingo_utils/tokenEmoji");
const { tokenLevels } = require("../bingo_utils/tokenLevels");

// Define the bingo command for Discord
module.exports = {
  name: "bingo",
  description:
    "Lists all champions with started token progress for EUW region.",
  detailedDescription:
    "Lists all champions with started token progress for EUW region. \n Usage: k!bingo [riotID]",
  async execute(message, args) {
    // Ensure the command is called with an argument
    if (args.length < 1) {
      return message.reply("Usage: k!bingo [riotID]");
    }

    // Combine arguments into a single Riot ID string
    const riotId = args.join("");
    // EUW is hardcoded for simplicity, but could be a command argument
    const region = "EUW";

    try {
      // Retrieve champion data from the external source
      const championsByTokens = await fetchChampionData(riotId, region);

      // Initialize the embed message for Discord
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${riotId}'s Mastery Bingo Board`)
        .setTimestamp()
        .setFooter({ text: "Champion Mastery Bingo" });

      // Loop through each token level to add to the embed
      tokenLevels.forEach((level) => {
        const champions = championsByTokens[level.description];
        // Only add embed fields for levels with champions
        if (champions.length > 0) {
          // Convert token counts to a string of emojis
          const emojiString = getEmojiString(
            level.tokenCount,
            level.noTokenCount
          );
          // Add a field to the embed for each token level
          embed.addFields([
            {
              name: "\u200b", // Invisible character for an empty field title
              value: `${emojiString} ${champions.join(", ")}`, // Champion names displayed besides token emojis
              inline: false, // Display fields vertically for readability
            },
          ]);
        }
      });

      // Send the constructed embed to the Discord channel
      message.reply({ embeds: [embed] });
    } catch (error) {
      // Log the error for troubleshooting
      console.error("Error retrieving or parsing data:", error);
      // Provide user-friendly feedback based on the error encountered
      if (error.response) {
        message.reply(
          `Failed to retrieve data: Server responded with status ${error.response.status}`
        );
      } else if (error.request) {
        message.reply("Failed to retrieve data: No response from the server.");
      } else {
        message.reply("An error occurred while processing your request.");
      }
    }
  },
};
