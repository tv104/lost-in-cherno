export const DAYZ_DEATH_MESSAGES = [
  "Player was sniped from 800m",
  "Player used infected bandages",
  "Player died of cholera",
  "Player was killed by a bear",
  "Player fell from a watchtower",
  "Player stepped on a landmine",
  "Player got lost in the woods",
  "Player died from drinking pond water",
  "Player was run over by their own vehicle",
  "Player accidentally ate rotten fruit",
  "Player got stuck in the queue",
  "No message received (connection lost)",
  "Player died to desync while climbing ladder",
  "Player was killed by invisible zombie",
  "Player fell through the map",
  "Player died while loading in",
  "BattlEye: Client not responding",
  "0x000400942 Data verification error",
];

export const getRandomDeathMessage = (messages: string[] = DAYZ_DEATH_MESSAGES): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
