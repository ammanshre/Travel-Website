import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  onRatingSelect: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ onRatingSelect }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    setRating(index);
    onRatingSelect(index);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"  
          onClick={() => handleClick(index)}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(rating)}
          className={`focus:outline-none ${
            index <= (hover || rating) ? 'text-primary' : 'text-gray-300 dark:text-gray-600'
          }`}
        >
          <Star className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};

export default Rating;
