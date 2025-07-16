import React, { useState } from 'react';
import { useSellerReview, useSubmitSellerReview, useUpdateSellerReview, useSellerReviewsBySellerId } from '../hooks/useSellerReview';
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
  const updateReview = useUpdateSellerReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
          isEditing ? (
            <form
              className="space-y-4 max-w-lg mx-auto"
              onSubmit={e => {
                e.preventDefault();
                updateReview.mutate(
                  { transactionId, rating, comment },
                  {
                    onSuccess: () => setIsEditing(false),
                  }
                );
              }}
            >
              <div className="flex items-center gap-4">
                <label className="font-gothic">Rating:</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="font-gothic mb-2">Comment:</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={updateReview.status === 'pending'}>
                  {updateReview.status === 'pending' ? 'Updating...' : 'Update Review'}
                </button>
                <button type="button" className="bg-gray-200 text-black px-4 py-2 rounded" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
              {updateReview.status === 'error' && <div className="text-red-600 mt-2">Error updating review.</div>}
              {updateReview.status === 'success' && <div className="text-green-600 mt-2">Review updated!</div>}
            </form>
          ) : (
            <div className="space-y-6">


            {/* Reviewer & Seller Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="font-gothic text-gray-500 text-xs mb-1">Reviewer</div>
                <div className="font-gothic text-black">{review.reviewer.firstName} {review.reviewer.lastName} <span className="text-gray-500">(@{review.reviewer.username})</span></div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="font-gothic text-gray-500 text-xs mb-1">Reviewed Seller</div>
                <div className="font-gothic text-black">{review.reviewedUser.firstName} {review.reviewedUser.lastName} <span className="text-gray-500">(@{review.reviewedUser.username})</span></div>
                <div className="text-xs text-yellow-700 font-gothic mt-1">Seller Rating: <span className="font-bold">{review.reviewedUser.sellerRating}</span> ({review.reviewedUser.sellerReviewsCount} reviews)</div>
              </div>
            </div>

               {/* Rating & Comment Section */}
               <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-gothic">Rating:</span>
                <StarRating value={review.rating} readOnly />
              </div>
            </div>
            <div className="mt-2 text-left">
              <span className="font-gothic">Comment:</span>
              <span className="ml-2 text-black italic">"{review.comment}"</span>
            </div>

            {/* Created At */}
            <div className="text-right text-xs text-gray-400 font-gothic mt-2">
              Reviewed at: {new Date(review.createdAt).toLocaleString()}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-gothic px-4 py-1 rounded shadow"
                onClick={() => {
                  setRating(review.rating);
                  setComment(review.comment);
                  setIsEditing(true);
                }}
              >
                Edit Review
              </button>
            </div>
          </div>
          )
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

interface SellerReviewListProps {
  sellerId: number;
}

export const SellerReviewList: React.FC<SellerReviewListProps> = ({ sellerId }) => {
  const { data: reviews, isLoading, error } = useSellerReviewsBySellerId(sellerId);

  console.log('SellerReviewList - sellerId:', sellerId, 'reviews:', reviews, 'isLoading:', isLoading, 'error:', error);
  
  if (isLoading) {
    return <div className="text-center text-gray-500 font-gothic">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-gothic">Failed to load reviews.</div>;
  }

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return <div className="text-center text-gray-500 font-gothic">No reviews for this seller yet.</div>;
  }
 
  return (
    <div className="space-y-8 mt-8">
      <h3 className="font-metal text-3xl text-black mb-6 text-center tracking-wider border-b-4 border-black pb-2">Seller Reviews</h3>
      {reviews.map((review) => (
        <Card key={review.reviewId} className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-yellow-50 via-white to-gray-100">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-stretch divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-6 md:w-1/3 bg-gradient-to-br from-yellow-100 to-white">
                <img
                  src={review.product.primaryImageUrl}
                  alt={review.product.title}
                  className="w-24 h-24 object-cover rounded border-2 border-black shadow-md bg-white"
                />
                <div>
                  <div className="font-metal text-lg text-black mb-1">{review.product.title}</div>
                  <div className="text-xs text-gray-700 font-gothic mb-1">Condition: <span className="font-bold">{review.product.condition}</span></div>
                 
                </div>
              </div>
              {/* Review Info */}
              <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-yellow-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="font-gothic text-black text-base">
                    Reviewer: <span className="font-bold">{review.reviewer.firstName} {review.reviewer.lastName}</span> <span className="text-gray-500">(@{review.reviewer.username})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-gothic">Rating:</span>
                    <StarRating value={review.rating} readOnly />
                  </div>
                </div>
                <div className="text-black italic text-lg mb-2 border-l-4 border-black pl-4 bg-yellow-50 py-2 rounded">
                  "{review.comment}"
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 font-gothic mb-2">
                  <span>Reviewed at: <span className="font-bold">{new Date(review.createdAt).toLocaleString()}</span></span>
                  <span>Amount: <span className="font-bold">{review.transactionAmount?.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</span></span>
                </div>
                <div className="text-xs text-yellow-800 font-gothic mt-1">
                  Seller Rating: <span className="font-bold">{review.reviewedUser.sellerRating}</span> (<span className="font-bold">{review.reviewedUser.sellerReviewsCount}</span> reviews)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 