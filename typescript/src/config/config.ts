import { config } from "dotenv";
import { Config } from "../types/config.ts";
import process from "node:process";

config(); // Loading env vars.

export const CONFIG: Config = {
  STUDY_CHANNELS: ["1280097701232513036", "1280097701232513036"],
  ROLE_NAMES: {
    STUDYING: "studying",
  },
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!, // Asserting that the var exists.
};
