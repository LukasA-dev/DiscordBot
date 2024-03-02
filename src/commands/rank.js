// Import the function to fetch a summoner's rank from op.gg
const { fetchRankFromOPGG } = require("../utilities/opggScraper");

module.exports = {
  name: "rank",
  description: "Fetches a summoner's rank from op.gg.",
  // Detailed usage instructions, including command syntax and valid region codes
  detailedDescription: 'Use `k!rank [SummonerName] [Region]` to fetch the rank of the specified summoner in the specified region. Valid regions include NA, EUW, EUNE, etc.',
  async execute(message, args) {
    // Combine all arguments except the last as the summoner name
    let summonerName = args.slice(0, -1).join(" ");
    // The last argument is assumed to be the region code
    let region = args[args.length - 1].toUpperCase();

    // If only one argument is provided, assume it's the summoner name and default the region to EUW
    if (args.length === 1) {
      summonerName = args[0];
      region = "EUW";
    }

    // Ensure a summoner name is provided
    if (!summonerName) {
      return message.reply("Please provide a summoner name. Usage: `k!rank [SummonerName] [Region]`");
    }

    try {
      // Fetch rank details from op.gg and reply with the information
      const rankDetails = await fetchRankFromOPGG(summonerName, region.toLowerCase());
      message.reply(rankDetails || "Could not fetch rank details. Please check the summoner name and region.");
    } catch (error) {
      console.error("Error fetching rank:", error);
      message.reply("An error occurred while fetching the rank.");
    }
  },
};
