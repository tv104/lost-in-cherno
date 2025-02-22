import { Box, ThemeUIStyleObject, Link } from "theme-ui";
import { GitHubIcon } from "./icons";

type Props = {
  sx?: ThemeUIStyleObject;
};

export const Footer = ({ sx }: Props) => {
  const styles: Record<string, ThemeUIStyleObject> = {
    container: {
      display: "flex",
      columnGap: 4,
      rowGap: 2,
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      ...sx,
    },
    link: {
      color: "text",
      textDecoration: "none",
      transition: "opacity 0.2s ease-in-out",
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      fontSize: "0.85rem",
      opacity: 0.66,

      "&:hover": {
        opacity: 1,
      },
    },
  };

  return (
    <Box sx={{ ...styles.container }} as="footer">
      <Link
        href="https://github.com/tv104/lost-in-cherno"
        sx={styles.link}
        target="_blank"
      >
        <GitHubIcon /> GitHub
      </Link>
      <Link href="https://dayz.com/" sx={styles.link} target="_blank">
        DayZ
      </Link>
      <Link href="https://suno.com/" sx={styles.link} target="_blank">
        Music by Suno
      </Link>
      <Link href="https://dayz.ginfo.gg/" sx={styles.link} target="_blank">
        2D map by iSurvive
      </Link>
    </Box>
  );
};
