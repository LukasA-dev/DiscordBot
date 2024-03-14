module.exports = {
  name: "lolaccs",
  description: "Manage your League of Legends accounts.",
  detailedDescription:
    "Use `k!lolaccs add [account1],[account2]` to add accounts, `k!lolaccs remove [account1],[account2]` to remove accounts, `k!lolaccs clear` to remove all accounts, `k!lolaccs @username` to view accounts of a mentioned user, and `k!lolaccs` to list your accounts.",
  async execute(message, args, client) {
    // Check if the first argument is a user mention
    const mention = args[0];
    let targetUser;
    if (mention && mention.startsWith("<@") && mention.endsWith(">")) {
      const mentionId = mention.replace(/\D/g, ""); // Extract numeric ID from mention
      targetUser = await client.users.fetch(mentionId).catch(() => null); // Fetch user by ID, handle invalid ID
      if (!targetUser) return message.reply("Invalid user mention.");
      args.shift(); // Remove the mention from args if valid
    } else {
      targetUser = message.author; // Default to the command issuer
    }

    const username = targetUser.id; // Use targetUser's Discord ID for account association
    const adminId = process.env.ADMIN_USERID; // Fetch the admin ID from the environment variables

    // Extract the subcommand (add, remove, clear) and parse account names
    const subCommand = args.shift();
    const accounts = args
      .join(" ")
      .split(",")
      .map((acc) => acc.trim());

    // Permission check for modifying commands (add, remove, clear)
    if (
      ["add", "remove", "clear"].includes(subCommand) &&
      username !== message.author.id &&
      message.author.id !== adminId
    ) {
      return message.reply(
        "You do not have permissions to modify other users' accounts."
      );
    }

    // Execute the subcommand logic: add, remove, clear, or list accounts
    switch (subCommand) {
      case "add":
        // Add provided accounts to the user's account list, avoiding duplicates
        await client.dbCollections.lolAccsCollection.updateOne(
          { username },
          { $addToSet: { accounts: { $each: accounts } } },
          { upsert: true }
        );
        break;
      case "remove":
        // Remove specified accounts from the user's account list
        await client.dbCollections.lolAccsCollection.updateOne(
          { username },
          { $pull: { accounts: { $in: accounts } } }
        );
        break;
      case "clear":
        // Clear all accounts from the user's account list
        await client.dbCollections.lolAccsCollection.updateOne(
          { username },
          { $set: { accounts: [] } }
        );
        break;
      default:
        // List all accounts associated with the target user
        const userAccs = await client.dbCollections.lolAccsCollection.findOne({
          username,
        });
        if (userAccs && userAccs.accounts.length > 0) {
          message.reply(
            `<@${username}>'s Accounts: ${userAccs.accounts.join(", ")}`
          );
        } else {
          message.reply(`<@${username}> has not added any accounts yet.`);
        }
        return;
    }

    // Confirm account list update to the user or admin
    const updatedAccs = await client.dbCollections.lolAccsCollection.findOne({
      username,
    });
    message.reply(
      `Account list updated for <@${username}>, new list: ${updatedAccs.accounts.join(
        ", "
      )}`
    );
  },
};
