module.exports = {
  name: 'help',
  description: 'Provides help on commands.',
  detailedDescription: 'Use `k!help [command]` to get detailed information on a specific command. If no command is specified, a list of all available commands will be displayed.',
  execute(message, args, client) {
    if (args.length === 0) {
      let helpMessage = 'Available commands:\n';

      client.commands.forEach((command) => {
        helpMessage += `- \`k!${command.name}\`: ${command.description}\n`;
      });

      helpMessage += 'For more detailed information on a specific command, use: `k!help [command]`.';
      message.channel.send(helpMessage);
    } else {
      const commandName = args[0].toLowerCase();

      if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);

        // Use detailedDescription if available, fall back to description if not
        const description = command.detailedDescription || command.description;
        message.channel.send(`\`k!${command.name}\`: ${description}`);
      } else {
        message.channel.send('Unknown command. Try `k!help` for a list of all commands.');
      }
    }
  },
};
