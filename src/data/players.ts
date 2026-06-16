import type { Player } from "../types/player";
import { MAX_HP, MIN_POWER } from "../assets/game-rules";

export const players: Player[] = [
  {
    id: 0,
    name: "Mama",
    hp: MAX_HP,
    power: MIN_POWER,
    wins: 0,
  },
  {
    id: 1,
    name: "Marek",
    hp: MAX_HP,
    power: MIN_POWER,
    wins: 0,
  },
];
