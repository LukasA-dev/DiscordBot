// Import necessary modules and functions
const { fetchLatestPatchNotes } = require("../utilities/patchScraper");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "patch",
  description: "Fetches the latest League of Legends patch notes.",
  detailedDescription:
    "Use `k!patch` to get the latest patch notes, with key changes summary and link to the official League of Legends patch notes website.",

  // The execute function is called when the command is used
  async execute(message) {
    try {
      // Fetch the latest patch notes data
      const patchData = await fetchLatestPatchNotes();

      // Check if patch data was successfully fetched
      if (patchData) {
        // Create an embed with the patch details
        const patchEmbed = new EmbedBuilder()
          .setColor("#c9186b") // Set a color for the embed
          .setTitle(`Patch ${patchData.title}`) // Set the title with the patch version
          .setURL(patchData.link) // Add a URL to the full patch notes
          .setDescription("Here are the highlights from the latest patch:") // Set a description
          .setImage(patchData.image) // Attach the highlights image
          .setTimestamp(); // Add a timestamp to the embed

        // Send the embed to the channel
        await message.reply({ embeds: [patchEmbed] });
      } else {
        // Respond with an error message if no patch data was found
        message.reply(
          "Could not fetch the latest patch notes. Please try again later."
        );
      }
    } catch (error) {
      // Log and respond with an error if something goes wrong
      console.error("Error fetching the latest patch notes:", error);
      message.reply("An error occurred while fetching patch notes details.");
    }
  },
};
