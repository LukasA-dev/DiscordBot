// Import necessary modules
const axios = require("axios");
const cheerio = require("cheerio");

// Function to fetch the most recent patch notes
async function fetchLatestPatchNotes() {
  try {
    // Fetch the patch notes summary page
    const summaryResponse = await axios.get('https://www.leagueoflegends.com/en-us/news/tags/patch-notes/');
    // Load the HTML content into Cheerio
    const $summary = cheerio.load(summaryResponse.data);

    // Find the first patch element on the summary page
    const firstPatchElement = $summary('ol.style__List-sc-106zuld-2 > li').first();
    // Extract the patch link and title
    const patchLink = firstPatchElement.find('a').attr('href');
    // Ensure the patch link is a full URL
    const fullPatchLink = patchLink.startsWith('http') ? patchLink : `https://www.leagueoflegends.com${patchLink}`;

    // Fetch the detailed patch notes page for the image
    const detailsResponse = await axios.get(fullPatchLink);
    const $details = cheerio.load(detailsResponse.data);

    // Use a CSS selector to find the patch highlights image
    const imageSrc = $details('#patch-notes-container > div:nth-of-type(2) > div > div > span > a').find('img').attr('src');

    // Return the patch details including the version, link, and image
    return {
      title: firstPatchElement.find('a').text().trim().match(/\d+\.\d+/)[0], // Extract just the version number
      link: fullPatchLink,
      image: imageSrc ? (imageSrc.startsWith('http') ? imageSrc : `https:${imageSrc}`) : null // Ensure the image URL is complete
    };
  } catch (error) {
    // Log any errors that occur during the fetch process
    console.error('Error fetching the latest patch notes:', error);
    return null; // Return null if an error occurs
  }
}

module.exports = { fetchLatestPatchNotes };