const axios = require("axios");
const cheerio = require("cheerio");
const { tokenLevels } = require("./tokenLevels");

// Fetch and process champion data
const fetchChampionData = async (riotId, region) => {
  // Encode the Riot ID for the URL
  const encodedRiotId = encodeURIComponent(riotId);
  const url = `https://championmastery.gg/player?riotId=${encodedRiotId}&region=${region}&lang=en_US`;

  // Fetch the HTML content from the external source
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Initialize an object to store champions by token level
  const championsByTokens = Object.fromEntries(
    tokenLevels.map((level) => [level.description, []])
  );

  // Loop through each champion row to find token data
  $("#tbody tr").each((index, element) => {
    const tokenTd = $(element).find("td:nth-child(6)");
    const tokensDataValue = tokenTd.attr("data-value");
    const nameTd = $(element).find("td:nth-child(1) a");
    const championName = nameTd.text().trim();
    const level = tokenLevels.find((level) => level.id === tokensDataValue);

    // Add the champion to the appropriate token level
    if (level) {
      championsByTokens[level.description].push(championName);
    }
  });

  return championsByTokens;
};

module.exports = { fetchChampionData };
