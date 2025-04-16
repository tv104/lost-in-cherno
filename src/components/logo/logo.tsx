import logo from "./logo.webp";
import { cn } from "@/utils";

type Props = {
  className?: string;
};

export const Logo: React.FC<Props> = ({ className }) => {
  return (
    <img
      src={logo}
      alt="Lost in Cherno logo"
      className={cn(
        "w-full h-auto max-w-[320px] md:max-w-[480px] aspect-[calc(37/31)]",
        className
      )}
    />
  );
};
