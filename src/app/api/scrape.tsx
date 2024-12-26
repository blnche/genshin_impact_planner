// src/pages/api/scrape.js
import scrapeCharacterCards from '../../utils/scrapeCharactersCards';

export default async function handler(req, res) {
  console.log(scrapeCharacterCards)
  if (req.method === 'GET') {
    try {
      await scrapeCharacterCards(); // Run the scraping function
      res.status(200).json({ message: 'Scraping completed successfully' });
    } catch (error) {
      console.error('Scraping failed:', error);
      res.status(500).json({ error: 'Scraping failed' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
