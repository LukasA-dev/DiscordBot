module.exports = {
  name: "lolaccs",
  description: "Manage your League of Legends accounts.",
  detailedDescription: "Use `k!lolaccs add [account1],[account2]` to add accounts, `k!lolaccs remove [account1],[account2]` to remove accounts, `k!lolaccs clear` to remove all accounts, and `k!lolaccs` to list your accounts.",
  async execute(message, args, client) {
    const subCommand = args.shift();
    const accounts = args.join(" ").split(",").map(acc => acc.trim());
    const username = message.author.id;

    if (["add", "remove", "clear"].includes(subCommand) && username !== message.author.id) {
      return message.reply("You do not have permissions for that.");
    }

    switch (subCommand) {
      case 'add':
        await client.lolAccsCollection.updateOne(
          { username },
          { $addToSet: { accounts: { $each: accounts } } },
          { upsert: true }
        );
        break;
      case 'remove':
        await client.lolAccsCollection.updateOne(
          { username },
          { $pull: { accounts: { $in: accounts } } }
        );
        break;
      case 'clear':
        await client.lolAccsCollection.updateOne(
          { username },
          { $set: { accounts: [] } }
        );
        break;
      default:
        const userAccs = await client.lolAccsCollection.findOne({ username });
        if (userAccs && userAccs.accounts.length > 0) {
          message.reply(`<@${username}> Accounts are ${userAccs.accounts.join(", ")}`);
        } else {
          message.reply(`<@${username}> have not added any accounts yet.`);
        }
        return;
    }

    const updatedAccs = await client.lolAccsCollection.findOne({ username });
    message.reply(`Your account has been updated, your new list: ${updatedAccs.accounts.join(", ")}`);
  }
};