import { FadeUp } from '@/components/animation/AnimatedWrapper';

interface ContinueExploringProps {
  issueNumber?: number;
  delay?: number;
}

export const ContinueExploring = ({ issueNumber = 25, delay = 0.6 }: ContinueExploringProps) => {
  return (
    <FadeUp delay={delay}>
      <div className="flex items-center justify-between mt-8 pt-2 border-t-2 border-black">
        <div className="flex items-center">
          <span className="font-gothic text-xs uppercase tracking-widest">Continue Exploring</span>
          <div className="w-12 h-[1px] bg-red-900 ml-3" />
        </div>
        <div className="flex items-center">
          <span className="font-serif italic text-xs mr-3">Issue {issueNumber}</span>
          <div className="w-6 h-[1px] bg-black"></div>
        </div>
      </div>
    </FadeUp>
  );
};

export default ContinueExploring; 