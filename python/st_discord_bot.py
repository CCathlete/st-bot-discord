import logging

import nextcord
from nextcord.ext import commands
from nextcord.utils import get
from typing import Optional

bot: commands.Bot = commands.Bot(
    command_prefix="_",
    help_command=None,
    member_cache_flags=nextcord.MemberCacheFlags.none(),
)


@bot.event
async def on_ready() -> None:
    logging.info(f"{bot.user} is ready!")
    logging.info(bot.guilds)


@bot.event
async def on_voice_state_update(
    member: nextcord.Member,
    before: nextcord.VoiceState,
    after: nextcord.VoiceState,
) -> None:
    if member.bot:
        return
    if after.channel and after.channel.id in [1234, 5678]:
        role: Optional[nextcord.Role] = get(member.guild.roles, name="studying")
        if role:
            await member.add_roles(role, atomic=True)
    if before.channel and before.channel.id in [1234, 5678]:
        role = get(member.guild.roles, name="studying")
        if role:
            await member.remove_roles(role, atomic=True)


bot.run("someKey")
