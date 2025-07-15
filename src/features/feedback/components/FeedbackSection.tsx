"use client";

import { useRef, useEffect, useState } from 'react';
import { useRatingStats, useAllRatings, useSubmitRating } from '../hooks';
import { Star, User, Pencil } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LoginModal } from '@/components/ui/login-modal';
import { toast } from 'sonner';

const MAX_COMMENT_LENGTH = 150;

export function FeedbackSection() {
  const { data: stats, isLoading: statsLoading } = useRatingStats();
  const { data: allRatings, isLoading: ratingsLoading } = useAllRatings();
  const { isAuthenticated } = useAuth();
  const submitRating = useSubmitRating();

  // Feedback form state
  const [showLogin, setShowLogin] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    if (rating < 1) {
      toast.error('Please select a rating.');
      return;
    }
    if (comment.length > MAX_COMMENT_LENGTH) {
      toast.error('Comment must be 150 characters or less.');
      return;
    }
    submitRating.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          toast.success('Thank you for your feedback!');
          setRating(0);
          setComment('');
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to submit feedback');
        },
      }
    );
  };

  // Helper for progress bar
  function getStarPercent(count: number) {
    if (!stats || stats.totalRatings === 0) return 0;
    return Math.round((count / stats.totalRatings) * 100);
  }

  const feedbackListRef = useRef<HTMLUListElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Auto-scroll effect for feedback list
  useEffect(() => {
    if (!isAutoScroll) return;
    const list = feedbackListRef.current;
    if (!list) return;
    let frame: number;
    let scrollStep = 1; // px per frame
    let interval = 30; // ms per frame

    function scrollList() {
      if (!list) return;
      // Seamless infinite scroll: duplicate list, reset at halfway
      const half = list.scrollHeight / 2;
      if (list.scrollTop >= half) {
        list.scrollTop -= half;
      } else {
        list.scrollTop += scrollStep;
      }
      frame = window.setTimeout(scrollList, interval);
    }
    frame = window.setTimeout(scrollList, interval);
    return () => window.clearTimeout(frame);
  }, [isAutoScroll, allRatings]);

  // Pause on hover
  function handleMouseEnter() { setIsAutoScroll(false); }
  function handleMouseLeave() { setIsAutoScroll(true); }

  return (
    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none mt-12 max-w-7xl mx-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-7 h-7 text-red-900" />
          <h3 className="font-metal text-2xl text-black tracking-wider">SYSTEM FEEDBACK</h3>
          <div className="h-7 w-[1px] bg-black mx-2"></div>
          <span className="font-gothic text-sm text-gray-600 tracking-wider">COMMUNITY</span>
        </div>
        <div className="w-24 h-1 bg-yellow-400 mb-6" />

        {/* Feedback Form */}
        {statsLoading ? (
          <div className="text-gray-500 font-gothic py-6 text-center">Loading stats...</div>
        ) : stats ? (
          <div className="mb-8 flex flex-col md:flex-row md:items-start gap-8">
            {/* Left: All stats in a single row, feedback form below */}
            <div className="flex-1 min-w-[340px] flex flex-col justify-center">
              <div className="flex flex-row items-center gap-8 w-full mb-8 mx-5">
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-bold text-black font-metal drop-shadow">{stats.averageRating.toFixed(1)}</span>
                  <Star className="w-7 h-7 text-yellow-500" fill="currentColor" />
                </div>
                
                
                <div className="flex flex-col flex-1 min-w-[180px] max-w-[320px] gap-0">
                  {[5,4,3,2,1].map(star => {
                    const count = [stats.fiveStarCount, stats.fourStarCount, stats.threeStarCount, stats.twoStarCount, stats.oneStarCount][5-star];
                    const percent = getStarPercent(count);
                    return (
                      <div key={star} className="flex items-center gap-2 mb-0.5">
                        <span className="font-gothic text-xs w-6 text-right text-gray-700">{star}★</span>
                        <div className="flex-1 h-3 bg-gray-200 border border-black rounded overflow-hidden relative">
                          <div
                            className="h-full bg-yellow-400 border-r-2 border-yellow-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="font-gothic text-xs w-6 text-left text-gray-700">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Feedback Form below stats */}
              <div className="mb-0">
                <form onSubmit={handleSubmit} className="bg-gray-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-red-700" />
                    <span className="font-metal text-lg text-black">Leave your feedback</span>
                  </div>
                  <p className="text-xs text-gray-500 italic ">
                    You can only leave one feedback. Submitting again will overwrite your previous feedback.
                  </p>
                  <div className="flex items-center gap-1 ">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${((hoverRating || rating) >= star) ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill={((hoverRating || rating) >= star) ? '#facc15' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="font-serif border-2 border-black  p-2 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={MAX_COMMENT_LENGTH}
                    required
                  />
                  <div className="flex justify-between items-center text-xs font-gothic text-gray-500">
                    <span>{comment.length}/{MAX_COMMENT_LENGTH} characters</span>
                    {comment.length > MAX_COMMENT_LENGTH && (
                      <span className="text-red-600">Too long!</span>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-red-900 hover:bg-red-800 text-white font-gothic border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-6 py-2 rounded transition-all duration-200 disabled:opacity-60"
                      disabled={submitRating.isPending}
                    >
                      {submitRating.isPending ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Right: Recent Feedback */}
            <div className="flex-1 md:w-1/2 sticky top-8">
              <h4 className="font-metal text-lg text-black mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Recent Feedback
              </h4>
              {ratingsLoading ? (
                <div className="text-gray-500 font-gothic py-6 text-center">Loading feedback...</div>
              ) : allRatings && allRatings.content.length > 0 ? (
                <ul
                  className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
                  ref={feedbackListRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Duplicate the feedbacks for seamless infinite scroll */}
                  {[...allRatings.content, ...allRatings.content].map((rating, idx) => (
                    <li key={rating.id + '-' + idx} className="bg-gray-50 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-gothic text-gray-700 font-bold">{rating.username}</span>
                        <span className="text-xs text-gray-400 ml-2">{new Date(rating.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= rating.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill={star <= rating.rating ? '#facc15' : 'none'}
                          />
                        ))}
                      </div>
                      <div className="text-gray-800 text-base italic">"{rating.comment}"</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 font-gothic py-6 text-center">No feedback yet.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 font-gothic py-6 text-center">No stats available.</div>
        )}

       

      </div>
      
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
} 