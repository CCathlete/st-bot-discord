import { Client, VoiceState, Role, Guild, GuildMember } from "discord.js";
import { CONFIG } from "../config/config.ts";

export class VoiceStateManager {
  private client: Client;
  // Better to store in some sort of hash map.
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
    console.log("Starting voice state update.");
    const guild: Guild | null = after.guild ?? before.guild;
    if (!guild) return;

    // The voice states ids are the member id so after.id = after.member?.id.
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
    // TODO: If member has a studyrole don't need to add.
    if (after.channelId && this.studyChannelIds.includes(after.channelId)) {
      await this.addStudyingRole(guild, member);
    }

    // TODO: Put in if else.
    if (before.channelId && this.studyChannelIds.includes(before.channelId)) {
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
      console.log(`Added studying role to ${member.user.tag}.`);
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
      console.log(`Removed studying role from ${member.user.tag}.`);
    }
  }
}
