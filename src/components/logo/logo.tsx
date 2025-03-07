import { Image, ThemeUIStyleObject } from "theme-ui";
import logo from "./logo.webp";

type Props = {
  sx?: ThemeUIStyleObject;
};

export const Logo: React.FC<Props> = ({ sx }) => {
  const styles: Record<string, ThemeUIStyleObject> = {
    logo: {
      width: "100%",
      height: "auto",
      maxWidth: ["320px", "480px"],
      aspectRatio: "37/31",
      ...sx,
    },
  };

  return <Image src={logo} alt="Lost in Cherno logo" sx={styles.logo} />;
};
