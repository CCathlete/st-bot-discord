import { Client, GatewayIntentBits } from "discord.js";
import { VoiceStateManager } from "./managers/VoiceStateManager.ts";

/**
 *
 * @class Bot
 */
export class Bot {
  private client: Client;
  private voiceStateManager: VoiceStateManager;

  constructor() {
    this.client = new Client({
      // Triggering the constructor with intents (permissions).
      // Intents are constants that each of their binary representations
      // is a power of 2 and represents a single permission.
      // The intents are being summed up (bitwise OR) during the initialisation.
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.voiceStateManager = new VoiceStateManager(this.client);
  }

  /**
   * The bot is a client that is listening for events using a websocket
   * (TCP connection). Whenever the client does Client.emit("ready") the
   * anonymous function is invoked. In bot.once the listener anonymous function
   * is invoked one time when the client sends the ready event message.
   * @method setupEventListeners
   */
  private setupEventListeners(): void {
    this.client.once("ready", () => {
      console.log(`${this.client.user?.tag} is ready.`);
    });
    this.voiceStateManager.initialise(); // This actually starts repetitive
    // event listening.
  }

  /**
   * @async @method read_handshake
   *
   * Inspecting the handshake response.
   */
  public async read_handshake(): Promise<void> {
    const response = await fetch("https://discord.com/api/v10/gateway");
    console.log([...response.headers]); // Printing the headers
    const data = await response.json();
    console.log(data); // Printing the response.
  }

  /**
   * @async @method start
   */
  public async start(token: string): Promise<void> {
    this.read_handshake();
    this.setupEventListeners();
    await this.client.login(token);
  }
}
