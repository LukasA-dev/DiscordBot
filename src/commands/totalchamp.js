const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "totalchamps",
  description: "Gets the total number of League of Legends champions.",
  async execute(message) {
    const url = "https://www.leagueoflegends.com/en-gb/champions/";

    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const champs = $(
        "#bltce2fa2f4ba0cba4f-section_1 > section > div.style__Body-sc-138hc9a-2.dwASKy > section.style__Wrapper-sc-13btjky-0.style__ResponsiveWrapper-sc-13btjky-4.kKksmy.SHyYQ > div.style__List-sc-13btjky-2.IorQY"
      ).children();
      message.reply(
        `The total number of League of Legends champions is: ${champs.length}`
      );
    } catch (error) {
      console.error("Error fetching total number of champions:", error);
      message.reply("Failed to retrieve the total number of champions.");
    }
  },
};
