const { PREFIX } = process.env; // Use the PREFIX from your .env file

module.exports = (client, commands) => {
  client.on("messageCreate", async (message) => {
    // Ignore messages from bots or messages that do not start with the prefix
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // Extract the command name and arguments from the message
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Fetch the command from the collection
    const command = commands.get(commandName);

    // If the command doesn't exist, return
    if (!command) return;

    try {
      // Execute the command
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`Error executing command '${commandName}':`, error);
      message.reply("there was an error trying to execute that command!");
    }
  });
};
