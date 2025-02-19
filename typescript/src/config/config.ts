import { config } from "dotenv";
import { Config } from "../types/config";

config(); // Loading env vars.

export const CONFIG: Config = {
  STUDY_CHANNELS: ["1326508796998189078", "1326508947019923456"],
  ROLE_NAMES: {
    STUDYING: "studying",
  },
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!, // Asserting that the var exists.
};
