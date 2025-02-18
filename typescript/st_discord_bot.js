"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const bot = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
});
bot.once("ready", () => {
    console.log(`${bot.user?.tag} is ready!`);
    console.log(bot.guilds.cache);
});
bot.on("voiceStateUpdate", async (before, after) => {
    const guild = after.guild ?? before.guild;
    if (!guild)
        return;
    const member = guild.members.cache.get(after.id) || guild.members.cache.get(before.id);
    // If member is undefined or a bot we exit the function.
    if (!member || member.user.bot)
        return;
    const roleName = "studying";
    const channelIds = [1234, 5678];
    if (after.channel && channelIds.includes(Number(after.channel.id))) {
        const role = guild.roles.cache.find((r) => r.name === roleName);
        if (role) {
            await member.roles.add(role, "User joined studying voice channel");
        }
    }
    if (before.channel && channelIds.includes(Number(before.channel.id))) {
        const role = guild.roles.cache.find((r) => r.name === roleName);
        if (role) {
            await member.roles.remove(role, "User left studying voice channel");
        }
    }
});
bot.login("someKey");
