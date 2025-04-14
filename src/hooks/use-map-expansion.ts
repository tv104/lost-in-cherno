import { useEffect, useRef } from "react";

import { LatLngTuple } from "leaflet";
import { useCallback } from "react";

type Props = {
    showAnswer: boolean,
    guessLocation: LatLngTuple | null,
    setIsExpanded: (isExpanded: boolean) => void,
}
export const useMapExpansion = ({ showAnswer, guessLocation, setIsExpanded }: Props) => {
    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (showAnswer || guessLocation) {
          setIsExpanded(true);
        }
      }, [showAnswer, guessLocation, setIsExpanded]);

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
    
        timeoutRef.current = window.setTimeout(() => {
          if (!showAnswer && !guessLocation) {
            setIsExpanded(false);
          }
        }, 1000);
      }, [showAnswer, guessLocation, setIsExpanded]);
    
      const handleMouseEnter = useCallback(() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        setIsExpanded(true);
      }, [setIsExpanded]);
    
      useEffect(() => {
        if (showAnswer || guessLocation) {
          setIsExpanded(true);
        }
      }, [showAnswer, guessLocation, setIsExpanded]);

      return {
        handleMouseLeave,
        handleMouseEnter,
      }
}
