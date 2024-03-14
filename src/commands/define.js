const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "define",
  description: "Defines a term.",
  detailedDescription:
    "Use `k!define [term]` to get the definition of a specific term from Urban Dictionary.",
  async execute(message, args) {
    if (args.length === 0) {
      // Send a message if no term is provided
      message.channel.send("Please provide a term to define.");
      return;
    }

    const term = args.join(" "); // Join the arguments back into a string if the term consists of multiple words

    try {
      const response = await axios.get(
        `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
          term
        )}`
      );
      const definitions = response.data.list;

      if (definitions.length === 0) {
        // Handle no definitions found
        message.channel.send(`No definitions found for "${term}".`);
        return;
      }

      // Assuming you want to send the first definition found
      const definition = definitions[0].definition.replace(/[\[\]]/g, ""); // Removing square brackets from the definition

      const defineEmbed = new EmbedBuilder()
        .setColor("#0099ff") // Set the color of the embed
        .setTitle(`Definition of ${term}`) // Set the title of the embed
        .setDescription(definition) // Set the definition as description
        .setFooter({ text: "Definition from Urban Dictionary" }) // Add a footer
        .setTimestamp(); // Add the current timestamp

      message.channel.send({ embeds: [defineEmbed] });
    } catch (error) {
      console.error("Error fetching definition:", error);
      message.channel.send(
        "There was an error trying to fetch the definition. Please try again later."
      );
    }
  },
};
