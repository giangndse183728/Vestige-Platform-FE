import React, { useState } from 'react';
import { useSellerReview, useSubmitSellerReview } from '../hooks/useSellerReview';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface SellerReviewProps {
  transactionId: number;
  orderStatus: string;
}

const StarRating: React.FC<{ value: number; onChange?: (v: number) => void; readOnly?: boolean }> = ({ value, onChange, readOnly }) => (
  <div className="flex items-center justify-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        className="p-0 m-0 bg-transparent border-none cursor-pointer"
        onClick={() => onChange && !readOnly && onChange(n)}
        tabIndex={-1}
        disabled={readOnly}
        aria-label={`Rate ${n}`}
      >
        <Star
          className={`w-6 h-6 ${n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${readOnly ? '' : 'hover:scale-110 transition-transform'}`}
          fill={n <= value ? '#facc15' : 'none'}
        />
      </button>
    ))}
  </div>
);

export const SellerReview: React.FC<SellerReviewProps> = ({ transactionId, orderStatus }) => {
  const { data: review, isLoading, error } = useSellerReview(transactionId);
  const submitReview = useSubmitSellerReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (
    error &&
    (
      (typeof error.message === 'string' && error.message.includes('only review transactions where you are the buyer')))
  ) {
    toast.error("You can only review transactions where you are the buyer.")
    return null;
  }

  if (orderStatus !== 'DELIVERED') {
    return (
      <Card variant="double" className="border-2 border-black my-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-gradient-to-b from-yellow-300 to-yellow-800">
          <h3 className="font-metal text-xl text-black">Seller Review</h3>
        </CardHeader>
        <CardContent className="p-8 bg-white text-center">
          <div className="text-gray-600 font-gothic">You can only review after the order is delivered.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="double" className="border-2 border-black my-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-2 border-black bg-gradient-to-b from-yellow-300 to-yellow-800">
        <h3 className="font-metal text-xl text-black">Seller Review</h3>
      </CardHeader>
      <CardContent className="p-8 bg-white">
        {isLoading ? (
          <div className="text-center text-gray-500 font-gothic">Loading review...</div>
        ) : review ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-gothic">Rating:</span>
              <StarRating value={review.rating} readOnly />
            </div>
            <div className="mb-2">
              <span className="font-gothic">Comment:</span> {review.comment}
            </div>
          </div>
        ) : (
          <form
            className="max-w-lg mx-auto"
            onSubmit={e => {
              e.preventDefault();
              submitReview.mutate({ transactionId, rating, comment });
            }}
          >
            <div className="mb-4 flex items-center gap-10">
              <label className="font-gothic">Rating:</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="mb-4 flex items-center gap-5">
              <label className="font-gothic mb-2">Comment:</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                rows={3}
              />
            </div>
            <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={submitReview.status === 'pending'}>
              {submitReview.status === 'pending' ? 'Submitting...' : 'Submit Review'}
            </button>
            {submitReview.status === 'error' && <div className="text-red-600 mt-2">Error submitting review. Maybe you are not a buyer</div>}
            {submitReview.status === 'success' && <div className="text-green-600 mt-2">Review submitted!</div>}
          </form>
        )}
      </CardContent>
    </Card>
  );
}; 