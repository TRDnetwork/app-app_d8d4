'use client';

import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <img
          src={review.user.avatar}
          alt={review.user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{review.user.name}</h4>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>
          <p className="mt-1 text-sm text-text_dim">{review.date}</p>
          <h3 className="mt-2 font-medium">{review.title}</h3>
          <p className="mt-2 text-text_dim">{review.comment}</p>
          
          {review.images && review.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {review.images.map((image, i) => (
                <div key={i} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Review image ${i + 1}`}
                    className="rounded object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-text_dim hover:text-text">
              Helpful ({review.helpful})
            </Button>
            <Button variant="ghost" size="sm" className="text-text_dim hover:text-text">
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}