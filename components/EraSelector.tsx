import React from 'react';
import { HistoricalEra } from '../types';

interface EraSelectorProps {
  selectedEraId: string | null;
  onSelect: (era: HistoricalEra) => void;
}

const ERAS: HistoricalEra[] = [
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs, pyramids, and gold.',
    promptSuffix: 'dressed as ancient Egyptian nobility with gold jewelry, headdress, and white linen robes, standing in front of the Great Pyramids of Giza and hieroglyphics, warm golden hour desert lighting, cinematic historical epic style',
    thumbnail: 'https://picsum.photos/seed/egypt/200/200'
  },
  {
    id: 'renaissance',
    name: 'The Renaissance',
    description: 'Art, science, and velvet robes.',
    promptSuffix: 'dressed in luxurious Italian Renaissance fashion, velvet robes or doublet with intricate embroidery, background of a Florence cathedral or artist studio with marble statues, soft sfumato lighting, classical oil painting style',
    thumbnail: 'https://picsum.photos/seed/renaissance/200/200'
  },
  {
    id: 'wild-west',
    name: 'The Wild West',
    description: 'Saloons, cowboys, and frontiers.',
    promptSuffix: 'dressed as a rugged cowboy or cowgirl with a leather stetson hat, bandana, and vest, standing on the dusty wooden porch of a western saloon, warm sunset lighting, cinematic western movie style',
    thumbnail: 'https://picsum.photos/seed/wildwest/200/200'
  },
  {
    id: '1920s',
    name: 'Roaring 20s',
    description: 'Jazz, flappers, and Art Deco.',
    promptSuffix: 'dressed in high-end 1920s fashion, sparkling flapper dress with pearls or sharp tuxedo, inside a lavish Art Deco ballroom party with champagne, cinematic lighting, slight vintage film grain',
    thumbnail: 'https://picsum.photos/seed/1920s/200/200'
  },
  {
    id: 'vikings',
    name: 'Viking Age',
    description: 'Warriors, furs, and fjords.',
    promptSuffix: 'dressed as a fierce Viking warrior with fur cloaks, leather armor, and intricate metalwork, standing on the prow of a longship in a misty fjord, cold dramatic lighting, television drama style',
    thumbnail: 'https://picsum.photos/seed/vikings/200/200'
  },
  {
    id: 'japan-feudal',
    name: 'Feudal Japan',
    description: 'Samurai, cherry blossoms, and honor.',
    promptSuffix: 'dressed in traditional samurai armor or elegant kimono, standing in a Japanese garden with cherry blossoms and a pagoda in the background, serene atmospheric lighting, cinematic style',
    thumbnail: 'https://picsum.photos/seed/japan/200/200'
  },
  {
    id: 'medieval',
    name: 'Medieval Knight',
    description: 'Armor, castles, and epic battles.',
    promptSuffix: 'wearing shining steel plate armor with a cape, standing in a medieval castle courtyard with stone walls and banners, dramatic lighting, fantasy historical art style',
    thumbnail: 'https://picsum.photos/seed/medieval/200/200'
  },
  {
    id: 'victorian',
    name: 'Victorian London',
    description: 'Steam, fog, and top hats.',
    promptSuffix: 'dressed in formal Victorian era clothing, top hat or corset dress, walking down a foggy cobblestone street in London with gas lamps, moody sepia tone',
    thumbnail: 'https://picsum.photos/seed/victorian/200/200'
  },
  {
    id: '1960s',
    name: 'Flower Power',
    description: 'Tie-dye, peace, and festivals.',
    promptSuffix: 'dressed in 1960s hippie fashion, tie-dye shirt, flower crown, round sunglasses, at an outdoor music festival with colorful psychedelic background, warm sunny lighting, vintage film style',
    thumbnail: 'https://picsum.photos/seed/1960s/200/200'
  },
  {
    id: 'noir',
    name: 'Film Noir',
    description: 'Shadows, detectives, and mystery.',
    promptSuffix: 'dressed as a 1940s private detective in a trench coat and fedora, standing under a streetlamp on a rainy night, high contrast black and white photography, cinematic film noir style',
    thumbnail: 'https://picsum.photos/seed/noir/200/200'
  },
  {
    id: '1980s',
    name: 'Retro 80s',
    description: 'Neon, synthwave, and big hair.',
    promptSuffix: 'wearing colorful 1980s fashion, denim jacket or windbreaker, big hair, background of a retro arcade with neon lights, synthwave aesthetic',
    thumbnail: 'https://picsum.photos/seed/1980s/200/200'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    description: 'High tech, low life, neon future.',
    promptSuffix: 'dressed in futuristic cyberpunk streetwear with glowing tech accessories and cybernetic implants, standing in a rainy neon-lit futuristic city street at night, cinematic sci-fi style',
    thumbnail: 'https://picsum.photos/seed/cyberpunk/200/200'
  }
];

export const EraSelector: React.FC<EraSelectorProps> = ({ selectedEraId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto py-6">
      {ERAS.map((era) => (
        <button
          key={era.id}
          onClick={() => onSelect(era)}
          className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 text-left h-40 ${
            selectedEraId === era.id 
              ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105 z-10' 
              : 'border-gray-700 hover:border-gray-500 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          <img src={era.thumbnail} alt={era.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 p-3 z-20 w-full">
            <h4 className="font-bold text-sm text-white drop-shadow-md">{era.name}</h4>
            <p className="text-[10px] text-gray-300 leading-tight mt-1 line-clamp-2 drop-shadow-sm">{era.description}</p>
          </div>
          {selectedEraId === era.id && (
            <div className="absolute top-2 right-2 z-20 bg-purple-600 rounded-full p-1">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};