import { Client, VoiceState, Role, Guild, GuildMember } from "discord.js";
import { CONFIG } from "../config/config.ts";

export class VoiceStateManager {
  private client: Client;
  private readonly studyChannelIds: string[] = CONFIG.STUDY_CHANNELS;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * @method initialise
   */
  public initialise(): void {
    this.client.on("voiceStateUpdate", this.handleVoiceStateUpdate.bind(this));
  }

  private async handleVoiceStateUpdate(
    before: VoiceState,
    after: VoiceState
  ): Promise<void> {
    const guild: Guild | null = after.guild ?? before.guild;
    if (!guild) return;

    const memberId: string | undefined = after.id || before.id;
    const member: GuildMember | undefined = guild.members.cache.get(memberId);
    if (!member || member.user.bot) return;

    await this.handleRoleUpdates(before, after, guild, member);
  }

  private async handleRoleUpdates(
    before: VoiceState,
    after: VoiceState,
    guild: Guild,
    member: GuildMember
  ): Promise<void> {
    if (after.channelId && this.studyChannelIds.includes(after.id)) {
      await this.addStudyingRole(guild, member);
    }

    if (before.channelId && this.studyChannelIds.includes(before.id)) {
      await this.removeStudyingRole(guild, member);
    }
  }

  private async addStudyingRole(
    guild: Guild,
    member: GuildMember
  ): Promise<void> {
    const role: Role | undefined = guild.roles.cache.find(
      (role: Role) => role.name === CONFIG.ROLE_NAMES.STUDYING
    );
    if (role) {
      await member.roles.add(role, "User joined studying voice channel.");
    }
  }

  private async removeStudyingRole(
    guild: Guild,
    member: GuildMember
  ): Promise<void> {
    const role: Role | undefined = guild.roles.cache.find(
      (role: Role) => role.name === CONFIG.ROLE_NAMES.STUDYING
    );
    if (role) {
      await member.roles.remove(role, "User left studying voice channel.");
    }
  }
}
