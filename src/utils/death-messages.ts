export const DAYZ_DEATH_MESSAGES = [
  "Got sniped from 800m",
  "Forgot to disinfect bandages",
  "Killed by a bear",
  "Fell from a watchtower",
  "Stepped on a landmine",
  "Server got DDOSed",
  "Drank pond water",
  "Run over by own vehicle",
  "Ate rotten fruit",
  "Got stuck in queue",
  "No message received (connection lost)",
  "Desynced while climbing ladder",
  "Killed by invisible zombie",
  "Fell through the map",
  "Died while loading in",
  "BattlEye: Client not responding",
  "0x000400942 Data verification error",
];

export const getRandomDeathMessage = (messages: string[] = DAYZ_DEATH_MESSAGES): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
