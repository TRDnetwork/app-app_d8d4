import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ReviewCardProps {
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount?: number;
  images?: string[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  rating,
  title,
  comment,
  date,
  helpfulCount = 0,
  images = [],
}) => {
  return (
    <div className="border-b border-border pb-4 last:border-b-0">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{name}</h4>
            <time className="text-sm text-text_dim">{date}</time>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-text_dim'
                )}
              />
            ))}
          </div>
          <h5 className="font-medium mt-1">{title}</h5>
          <p className="text-text_dim mt-1">{comment}</p>
          {images.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {images.map((img, i) => (
                <img key={i} src={img} alt="Review" className="h-16 w-16 object-cover rounded" />
              ))}
            </div>
          )}
          <div className="mt-2">
            <button className="text-sm text-accent hover:underline">
              {helpfulCount} found this helpful
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;