module.exports = {
  name: "help",
  description: "Provides help on commands.",
  detailedDescription:
    "Use `k!help [command]` to get detailed information on a specific command. If no command is specified, a list of all available commands will be displayed.",
  execute(message, args, client) {
    // If no command is specified, list all available commands
    if (args.length === 0) {
      let helpMessage = "Available commands:\n";

      // Append each command and its description to the help message
      client.commands.forEach((command) => {
        helpMessage += `- \`k!${command.name}\`: ${command.description}\n`;
      });

      helpMessage +=
        "Use: `k!help [command]` for detailed information on a specific command.";
      message.channel.send(helpMessage);
    } else {
      // If a specific command is requested, display detailed information about it
      const commandName = args[0].toLowerCase();

      if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        const description = command.detailedDescription || command.description; // Use detailedDescription if available
        message.channel.send(`\`k!${command.name}\`: ${description}`);
      } else {
        // Handle unknown command requests
        message.channel.send(
          "Unknown command. Try `k!help` for a list of all commands."
        );
      }
    }
  },
};
