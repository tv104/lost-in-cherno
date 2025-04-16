import { GitHubIcon } from "../icons";
import { cn } from "@/utils";

type Props = {
  className?: string;
};

export const Footer = ({ className }: Props) => {
  const linkClassName = cn(
    "inline-flex text-sm opacity-66 gap-2 hover:opacity-100 items-center leading-none"
  );

  return (
    <footer
      className={cn(
        "flex gap-y-3 gap-x-5 flex-wrap items-center justify-center",
        className
      )}
    >
      <a
        href="https://github.com/tv104/lost-in-cherno"
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon /> GitHub
      </a>
      <a
        href="https://dayz.com/"
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        DayZ
      </a>
      <a
        href="https://dayz.ginfo.gg/"
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        2D map by iZurvive
      </a>
      <a
        href="https://suno.com/"
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        Music by Suno
      </a>
    </footer>
  );
};
