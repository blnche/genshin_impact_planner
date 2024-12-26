'use client';
import { useState, useEffect } from 'react';

export default function MaterialDisplay() {
  const [materialIcons, setMaterialIcons] = useState([]);
//   const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetch('/talentMaterials.json')
      .then(response => response.json())
      .then(data => {
        setMaterialIcons(data);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div>
      <h1>Character Image Display</h1>

    {materialIcons.map((icon, index) => (
        <div key={index}>
            <h2>{icon.talentName}</h2>
            <p>{icon.talentDropDomainName}</p>
            <p>Available on : </p>
            <ol>
                {icon.talentDaysOfweek.map((day, index) => (
                    <li key={index}>{day}</li>
                ))}
            </ol>
            <img src={icon.images[0]} />
        </div>
    ))}
      
    </div>
  );
}
