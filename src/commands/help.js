const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Provides help on commands.",
  detailedDescription:
    "Use `k!help [command]` to get detailed information on a specific command. If no command is specified, a list of all available commands will be displayed.",
  execute(message, args, client) {
    const helpEmbed = new EmbedBuilder()
      .setColor("#0099ff") // Set the color of the embed
      .setTitle("Help") // Set the title of the embed
      .setFooter({
        text: "Use k!help [command] for more details on a specific command.",
      }) // Add a footer
      .setTimestamp(); // Add the current timestamp

    // If no command is specified, list all available commands
    if (args.length === 0) {
      let commandsList = "";

      // Append each command and its description to the commandsList string
      client.commands.forEach((command) => {
        commandsList += `- \`k!${command.name}\`: ${command.description}\n`;
      });

      helpEmbed
        .setDescription("Available commands:")
        .addFields({ name: "Commands", value: commandsList });

      message.channel.send({ embeds: [helpEmbed] });
    } else {
      // If a specific command is requested, display detailed information about it
      const commandName = args[0].toLowerCase();

      if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        const description = command.detailedDescription || command.description; // Use detailedDescription if available

        helpEmbed
          .setTitle(`Help: k!${command.name}`)
          .setDescription(description);

        message.channel.send({ embeds: [helpEmbed] });
      } else {
        // Handle unknown command requests
        helpEmbed
          .setTitle("Unknown Command")
          .setDescription("Try `k!help` for a list of all commands.");

        message.channel.send({ embeds: [helpEmbed] });
      }
    }
  },
};
