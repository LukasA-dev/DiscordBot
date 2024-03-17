// Scraping constants
const axios = require("axios");
const cheerio = require("cheerio");

// Scraping opgg functions
async function fetchRankFromOPGG(riotId, region = "euw") {
  try {
    // Replace '#' with '-' to match the op.gg URL format for Riot IDs
    const formattedRiotId = riotId.replace("#", "-");
    const response = await axios.get(
      `https://${region}.op.gg/summoners/${region}/${encodeURI(
        formattedRiotId
      )}`
    );

    const $ = cheerio.load(response.data);
    let rankInfo = {
      rank: "Unranked",
      lp: "0 LP",
      winRate: "0%",
    };

    // Loop through each div that has a header class
    $("div.header").each((i, elem) => {
      // Check if the header text is "Ranked Solo"
      if ($(elem).text().trim() === "Ranked Solo") {
        // Navigate to the parent and then find the div with class tier, lp, and ratio.
        const parentDiv = $(elem).parent();
        rankInfo.rank = parentDiv.find("div.tier").first().text().trim();
        rankInfo.lp = parentDiv.find("div.lp").first().text().trim();
        rankInfo.winRate = parentDiv
          .find("div.ratio")
          .first()
          .text()
          .trim()
          .split(" ")[2]; // Extracting only the percentage
        return false; // Break the loop
      }
    });

    return `${riotId} is ${rankInfo.rank}, ${rankInfo.lp} with a ${rankInfo.winRate} winrate`;
  } catch (error) {
    console.error("Error fetching rank from OPGG:", error);
    return null;
  }
}

module.exports = { fetchRankFromOPGG };
