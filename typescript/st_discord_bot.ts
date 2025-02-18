import {
  Client,
  GatewayIntentBits,
  GuildMember,
  VoiceState,
  Role,
  Guild,
} from "discord.js";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

bot.once("ready", () => {
  console.log(`${bot.user?.tag} is ready!`);
  console.log(bot.guilds.cache);
});

bot.on("voiceStateUpdate", async (before: VoiceState, after: VoiceState) => {
  const guild: Guild | null = after.guild ?? before.guild;
  if (!guild) return;

  const member: GuildMember | undefined =
    guild.members.cache.get(after.id) || guild.members.cache.get(before.id);

  // If member is undefined or a bot we exit the function.
  if (!member || member.user.bot) return;

  const roleName = "studying";
  const channelIds = [1234, 5678];

  if (after.channel && channelIds.includes(Number(after.channel.id))) {
    const role: Role | undefined = guild.roles.cache.find(
      (r) => r.name === roleName
    );
    if (role) {
      await member.roles.add(role, "User joined studying voice channel");
    }
  }

  if (before.channel && channelIds.includes(Number(before.channel.id))) {
    const role: Role | undefined = guild.roles.cache.find(
      (r) => r.name === roleName
    );
    if (role) {
      await member.roles.remove(role, "User left studying voice channel");
    }
  }
});

bot.login("someKey");
