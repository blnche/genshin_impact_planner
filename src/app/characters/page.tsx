'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function CharacterDisplay() {
  const [characterCards, setCharacterCards] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    fetch('/filtered_character_cards.json')
      .then(response => response.json())
      .then(data => {
        setCharacterCards(data);
        if (data.length > 0) {
          setSelectedCharacter(data[0]);
          setIframeSrc(data[0].images[0]);
        }
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleCharacterChange = (event) => {
    const character = characterCards.find(char => char.name === event.target.value);
    setSelectedCharacter(character);
    setIframeSrc(character.images[0]);
  };

  return (
    <div className='font-[family-name:var(--font-geist-sans)]'>
      <h1>Character Image Display</h1>

      <select onChange={handleCharacterChange} value={selectedCharacter?.name || ''}>
        {characterCards.map((char, index) => (
          <option key={index} value={char.name}>
            {char.name}
          </option>
        ))}
      </select>

      {selectedCharacter && (
        <>
          <button onClick={() => setIframeSrc(selectedCharacter.images[0])}>
            Load Image
          </button>
          <div className='w-[15.625rem] h-[27.8125rem] bg-black'>
            <Image 
              src={iframeSrc} 
              alt="Character Image"
              width={1080}
              height={1920}
            />
          </div>
        </>
      )}
    </div>
  );
}
