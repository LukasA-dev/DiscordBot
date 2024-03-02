module.exports = {
  name: "lolaccs",
  description: "Manage your League of Legends accounts.",
  // Detailed instructions for managing LoL accounts using various subcommands
  detailedDescription: "Use `k!lolaccs add [account1],[account2]` to add accounts, `k!lolaccs remove [account1],[account2]` to remove accounts, `k!lolaccs clear` to remove all accounts, and `k!lolaccs` to list your accounts.",
  async execute(message, args, client) {
    // Extract the subcommand (add, remove, clear) and parse account names
    const subCommand = args.shift();
    const accounts = args.join(" ").split(",").map(acc => acc.trim());
    const username = message.author.id; // User's Discord ID for account association

    // Permission check: Ensure the command issuer matches the intended account modifier
    if (["add", "remove", "clear"].includes(subCommand) && username !== message.author.id) {
      return message.reply("You do not have permissions for that.");
    }

    // Execute the subcommand logic: add, remove, clear, or list accounts
    switch (subCommand) {
      case 'add':
        // Add provided accounts to the user's account list, avoiding duplicates
        await client.lolAccsCollection.updateOne(
          { username },
          { $addToSet: { accounts: { $each: accounts } } },
          { upsert: true }
        );
        break;
      case 'remove':
        // Remove specified accounts from the user's account list
        await client.lolAccsCollection.updateOne(
          { username },
          { $pull: { accounts: { $in: accounts } } }
        );
        break;
      case 'clear':
        // Clear all accounts from the user's account list
        await client.lolAccsCollection.updateOne(
          { username },
          { $set: { accounts: [] } }
        );
        break;
      default:
        // List all accounts associated with the user
        const userAccs = await client.lolAccsCollection.findOne({ username });
        if (userAccs && userAccs.accounts.length > 0) {
          message.reply(`<@${username}> Accounts are ${userAccs.accounts.join(", ")}`);
        } else {
          message.reply(`<@${username}> have not added any accounts yet.`);
        }
        return;
    }

    // Confirm account list update to the user
    const updatedAccs = await client.lolAccsCollection.findOne({ username });
    message.reply(`Your account has been updated, your new list: ${updatedAccs.accounts.join(", ")}`);
  }
};
