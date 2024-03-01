const { fetchRankFromOPGG } = require("../utilities/opggScraper");

module.exports = {
  name: "rank",
  description: "Fetches a summoner's rank from op.gg.",
  detailedDescription: 'Use `k!rank [SummonerName] [Region]` to fetch the rank of the specified summoner in the specified region. Valid regions include NA, EUW, EUNE, etc.',
  async execute(message, args) {
    let summonerName = args.slice(0, -1).join(" ");
    let region = args[args.length - 1].toUpperCase();

    // Default to EUW if no region is provided
    if (args.length === 1) {
      summonerName = args[0];
      region = "EUW";
    }

    if (!summonerName) {
      return message.reply("Please provide a summoner name. Usage: `k!rank [SummonerName] [Region]`");
    }

    try {
      const rankDetails = await fetchRankFromOPGG(summonerName, region.toLowerCase());
      message.reply(rankDetails || "Could not fetch rank details. Please check the summoner name and region.");
    } catch (error) {
      console.error("Error fetching rank:", error);
      message.reply("An error occurred while fetching the rank.");
    }
  },
};
