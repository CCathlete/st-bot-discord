import {
  Client,
  GatewayIntentBits,
  GuildMember,
  VoiceState,
  Role,
  Guild,
} from "discord.js";

// Triggering the constructor with intents (permissions).
// Intents are constants that each of their binary representations
// is a power of 2 and represents a single permission.
// The intents are being summed up (bitwise OR) during the initialisation.
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// The bot is a client that is listening for events using a websocket
// (TCP connection). Whenever the client does Client.emit("ready") the
// anonymous function is invoked. In bot.once the listener anonymous function
// is invoked one time when the client sends the ready event message.
bot.once("ready", () => {
  console.log(`${bot.user?.tag} is ready!`);
  console.log(bot.guilds.cache);
});

// Repetitive triggering of the listener function when the voiceStateUpdate
// event is triggered. Each time the event is emitted the listener function
// is called in a concurrent thread so that the client can keep listening.
bot.on("voiceStateUpdate", async (before: VoiceState, after: VoiceState) => {
  // Getting the server info object (guild) from the after state (default) or
  // the before state (fallback if the after state is undefined or null).
  const guild: Guild | null = after.guild ?? before.guild;
  if (!guild) return; // If guild is null we exit the function.

  // We use || and not ?? since empty strings are also false in this case.
  const member: GuildMember | undefined =
    guild.members.cache.get(after.id) || guild.members.cache.get(before.id);
  // If member is undefined or a bot we exit the function.
  if (!member || member.user.bot) return;

  const roleName = "studying";
  const channelIds = [1234, 5678];

  // If the user joined one of the channels above, we find the "studying"
  // role in guild.roles.cache and if we found it successfully we add the
  // "studying" role to member.roles.
  if (after.channel && channelIds.includes(Number(after.channel.id))) {
    const role: Role | undefined = guild.roles.cache.find(
      // An anonymous func that gets r and checks is strictly equal to roleName.
      (r) => r.name === roleName
    );
    if (role) {
      await member.roles.add(role, "User joined studying voice channel");
    }
  }

  // Similarly to the after state, if the user had left one of the above
  // channels, we remove the "studying" role from member.roles.
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
