import { Client, VoiceState } from "discord.js";

export class VoiceStateManager {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * initialise
   */
  public initialise() {}
}
