module.exports = {
  name: "reset",
  description: "Resets the specified database collection.",
  detailedDescription:
    "Use `k!reset [COLLECTION] to wipe all data from the collection eg. `k!reset lolAccsCollection` to wipe all data from the LOL accounts collection. This command can only be used by ADMIN.",

  async execute(message, args, client) {
    // Get admin user ID from .env file
    const adminID = process.env.ADMIN_USERID;

    // Check if the message author is an admin
    if (message.author.id !== adminID) {
      return message.reply("You do not have permission to use this command.");
    }

    // Check if the argument is provided and valid
    if (!args.length || !client.dbCollections.hasOwnProperty(args[0])) {
      return message.reply(
        "Please specify a valid collection to reset! example: `voiceActivityCollection`"
      );
    }

    // Determine the collection to reset
    const collectionName = args[0];
    const collection = client.dbCollections[collectionName];

    // Attempt to delete all documents from the specified collection
    try {
      await collection.deleteMany({});
      console.log(`All documents in ${collectionName} have been deleted.`);
      message.reply(`The \`${collectionName}\` has been successfully reset.`);
    } catch (error) {
      console.error(`Error resetting ${collectionName}:`, error);
      message.reply(
        `Failed to reset the \`${collectionName}\`. Please check the logs for details.`
      );
    }
  },
};
