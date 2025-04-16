import { useRef, useEffect, useState } from "react";
import { VolumeUpIcon, VolumeMuteIcon } from "../icons";
import backgroundMusic from "./lost-in-cherno.mp3";
import { cn } from "@/utils";

const containerStyles = cn("absolute top-6 right-6 z-[var(--z-audioPlayer)]");
const playButtonStyles = cn(
  "bg-transparent cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-100"
);
const svgStyles = cn("drop-shadow-[var(--drop-shadow-overlay)] size-6");

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [userPrefersMuted, setUserPrefersMuted] = useState(() => {
    return localStorage.getItem("audioPreference") === "muted";
  });

  // Initial autoplay attempt
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      // Only attempt autoplay if user hasn't previously muted
      if (!userPrefersMuted) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedOnce(true);
          })
          .catch(() => {
            setIsPlaying(false);
            console.log(
              "Initial autoplay failed, waiting for user interaction"
            );
          });
      }
    }
  }, [userPrefersMuted]);

  // Second autoplay attempt on user interaction to work around autoplay policy
  useEffect(() => {
    if (hasStartedOnce || userPrefersMuted) return;

    const startAudio = () => {
      if (audioRef.current && !hasStartedOnce) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStartedOnce(true);
          })
          .catch(() => {
            console.log("Audio play failed, will retry on next interaction");
          });
      }
    };

    const interactions = ["click", "touchstart", "keydown", "mousemove"];
    interactions.forEach((event) => {
      document.addEventListener(event, startAudio, { once: true });
    });

    return () => {
      interactions.forEach((event) => {
        document.removeEventListener(event, startAudio);
      });
    };
  }, [hasStartedOnce, userPrefersMuted]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        localStorage.setItem("audioPreference", "muted");
        setUserPrefersMuted(true);
      } else {
        await audioRef.current.play();
        localStorage.setItem("audioPreference", "playing");
        setUserPrefersMuted(false);
      }
    } catch (error) {
      console.log("Error toggling play/pause:", error);
    }
  };

  return (
    <div className={containerStyles}>
      <audio ref={audioRef} src={backgroundMusic} loop />
      <button className={playButtonStyles} onClick={togglePlayPause}>
        {isPlaying ? (
          <VolumeUpIcon className={svgStyles} />
        ) : (
          <VolumeMuteIcon className={svgStyles} />
        )}
      </button>
    </div>
  );
};
