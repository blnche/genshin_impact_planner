async function scrapeCharacterCards() {
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const genshindb = require('genshin-db');

    let names = [];

    async function getCharactersNames() {
      names = await genshindb.characters('names', { matchCategories: true })
      console.log('Fetched character names:', names);
    }
    await getCharactersNames()

    const folder = [];

  async function getCharacterCard(name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://genshin-impact.fandom.com/wiki/${name}`);
    await page.waitForSelector('aside');

    const imgUrls = await page.evaluate(() => {
      console.log('here')
      const aside = document.querySelector('aside');
      if (!aside) return [];
      const images = [];
      const imgTags = aside.querySelectorAll('img');
      imgTags.forEach(img => {
        const src = img.src;
        if (src && src.includes('static.wikia.nocookie.net/gensin-impact/images/')) {
          images.push(src);
        }
      });
      return images;
    });

    await browser.close();

    const filteredImages = imgUrls
      .filter(url => {
        const cardPattern = /\/([a-zA-Z]+)_Card\.png/;
        const fullWishPattern = /Character_([a-zA-Z]+)_Full_Wish\.png/;
        return cardPattern.test(url) || fullWishPattern.test(url);
      })
      .map(url => url.split('.png')[0] + '.png');

    return filteredImages;
  }

  for (const name of names) {
    try {
      const images = await getCharacterCard(name);
      if (images.length > 0) {
        folder.push({ name, images });
      }
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
    }
  }

  fs.writeFileSync('public/filtered_character_cards.json', JSON.stringify(folder, null, 2), 'utf8');
  console.log('Data written to filtered_character_cards.json');
}
// scrapeCharacterCards().catch(error => console.error('Error during scraping:', error));

module.exports = scrapeCharacterCards;
