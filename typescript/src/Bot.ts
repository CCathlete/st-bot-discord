import { Client, GatewayIntentBits } from "discord.js";
import { VoiceStateManager } from "./managers/VoiceStateManager";

export class Bot {
  private client: Client;
  private voiceStateManager: VoiceStateManager;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.voiceStateManager = new VoiceStateManager(this.client);
  }

  private setupEventListeners(): void {
    this.client.once("ready", () => {
      console.log(`${this.client.user?.tag} is ready.`);
    });
    this.voiceStateManager.initialise();
  }

  /**
   * start
   */
  public async start(token: string): Promise<void> {
    this.setupEventListeners();
    await this.client.login(token);
  }
}
