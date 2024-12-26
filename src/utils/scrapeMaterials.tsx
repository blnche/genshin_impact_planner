async function scrapeMaterials() {
    const puppeteer = require('puppeteer');
    const genshindb = require('genshin-db');
    const fs = require('fs');

    const isValidMaterial = material => material
        && material.typeText
        && material.category
        && material.sortRank
        && material.description
        && material.name;

    const defaultOptions = {matchCategories: true, verboseCategories: true};

    const allMaterials = genshindb
        .materials('names', defaultOptions)
        .filter(material => isValidMaterial(material))
        .sort((a, b) => a.sortRank === b.sortRank ? a.id - b.id : a.sortRank - b.sortRank);

    const characterAscensionMaterials = allMaterials
        .filter(material => material.typeText
        .startsWith('Character Ascension Material'));

    const characterLVLMaterials = allMaterials
        .filter(material => material.typeText
        .startsWith('Character Level-Up Material') && !material.description.startsWith('Character Ascension'));

    const characterWeaponEnhancementMaterials = allMaterials
        .filter(material => material.typeText
        .startsWith('Character and Weapon Enhancement Material'));

    const fish = allMaterials
        .filter(material => material.typeText === 'Fish');

    const localSpecialties = allMaterials
        .filter(material => material.typeText
        .startsWith('Local'));

    const talentMaterials = allMaterials
        .filter(material => material.typeText
        .startsWith('Character Talent Material') && !material.name
        .startsWith('Crown of Insight'));

    const weaponMaterials = allMaterials
        .filter(material => material.typeText
        .startsWith('Weapon Ascension Material'));

    const wood = allMaterials
        .filter(material => material.category === 'WOOD');

    const buildingMaterials = allMaterials
        .filter(material => material.sortRank === 301 || material.sortRank === 331);


    const folder = []

    function formatNameForUrl(name) {
        // Replace spaces with underscores to match the URL format
        return name.replace(/\s+/g, '_');
    }

    async function getTalentMaterialIcon(talentMaterialName) {
        const formattedName = formatNameForUrl(talentMaterialName); // Format the name for the URL
        // Encode the material name to handle special characters (e.g., apostrophes in 'Sentry's')
        const encodedName = encodeURIComponent(formattedName);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://genshin-impact.fandom.com/wiki/${encodedName}`);
        await page.waitForSelector('aside');
        
        const imgUrls = await page.evaluate(() => {
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
            console.log(images)
            return images;
        });
        console.log('imgurl: '+imgUrls)
        await browser.close();

        // Filter the image URLs to match the specific format and remove anything after .png
        const filteredImages = imgUrls
            .filter(url => {
                // Match URLs starting with "Item_" and ending with ".png" (ignoring the rest of the URL)
                const itemPattern = /https:\/\/static\.wikia\.nocookie\.net\/gensin-impact\/images\/[a-zA-Z0-9\/%]+\/Item_[a-zA-Z0-9_%]+\.png/;
                return itemPattern.test(url);
            })
            .map(url => url.split('.png')[0] + '.png'); // Remove everything after .png

            console.log('filtred img: '+filteredImages)
        return filteredImages;
    }

    for (const talentMaterial of talentMaterials) {
        const talentName = talentMaterial.name
        const talentRarity = talentMaterial.rarity
        const talentDropDomainName = talentMaterial.dropDomainName
        const talentDaysOfweek = talentMaterial.daysOfWeek

        try {
            const images = await getTalentMaterialIcon(talentName);
            if (images.length > 0) {
                folder.push({ talentName, talentRarity, talentDropDomainName, talentDaysOfweek, images });
            }
            else {
                console.log('no image found in loop')
            }
        } catch (error) {
            console.error(`Error fetching data for ${talentMaterial}:`, error);
        }
    }


    fs.writeFile('public/talentMaterials.json', JSON.stringify(folder, null, 2), 'utf8', error => {
        if (error) {
            console.error(error);
        }
    });
}

module.exports = scrapeMaterials;