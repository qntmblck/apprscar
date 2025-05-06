import { useState } from 'react';
import './Flashcard.css';

export default function Flashcard({ title, description, image }) {
  const [flipped, setFlipped] = useState(false);

  const descriptionList = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div
      className="flashcard-container perspective cursor-pointer w-full h-64"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`flashcard-inner transform-style duration-700 w-full h-full relative ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-start bg-white">
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={image}
              alt={title}
              className="max-h-[100px] object-contain"
            />
          </div>
          <div className="w-full bg-indigo-800 text-white text-center py-2 rounded-b-xl">
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl shadow-lg bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700 p-4 flex flex-col justify-center items-start text-white">
          <h3 className="text-base font-bold mb-2">{title}</h3>
          <ul className="text-base sm:text-sm font-normal space-y-1 list-disc list-inside leading-relaxed">
            {descriptionList.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
