import { Footer } from "./footer";
import { Logo } from "../logo/logo";
import { useEffect, useRef } from "react";
import { cn } from "@/utils";

type Props = {
  children: React.ReactNode;
  isExiting: boolean;
  onExited: () => void;
};

const TRANSITION_DURATION = 2000;

const containerStyles = cn(
  `bg-secondary absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-start z-overlay p-4 overflow-y-auto opacity-100 transition-opacity duration-${TRANSITION_DURATION} ease-in`
);

const contentContainerStyles = cn(
  "flex flex-col items-center justify-center gap-4 my-auto text-center pb-5"
);

export const Overlay: React.FC<Props> = ({ children, isExiting, onExited }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isExiting && !isTransitioning.current) {
      isTransitioning.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onExited();
        isTransitioning.current = false;
      }, TRANSITION_DURATION);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isExiting, onExited]);

  return (
    <div
      ref={containerRef}
      className={cn(
        containerStyles,
        isExiting && "opacity-0",
        isExiting && "pointer-events-none",
        isExiting && "will-change-opacity"
      )}
    >
      <div className={contentContainerStyles}>
        <Logo className="mb-4" />
        {children}
      </div>
      <Footer />
    </div>
  );
};
