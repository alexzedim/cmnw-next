---
title: (EN) Discord Bot
description: Manual for Conglomerat Discord bot.
updatedAt: 2020-04-12
---

## How to invite?

If you want to invite our bot to your Discord server, just press this glorious button right below and auth at Discord.com *(you won't do it, if you have an active session)*.

<a href="https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot" role="button"><button style="background:#7289DA;width:130px;border-radius:4px;padding:7px 14px;font:600 18px 'Roboto';color:#fff">Invite</button></a>

In case, if you prefer to generate an invitation link by yourself:

```
https://discord.com/oauth2/authorize?client_id=318324033940750337&scope=bot
```

For both of us, it will be better, if Discord bot will have its own, separate channel for input commands, otherwise he will react for every word, from the command pool.

### Access rights

Bot will require:

- Send Messages
- Embed Links
- Attach Files
- View Channels

Conglomerat bot **doesn't** require for any server management options or administrator permissions. The permissions' integer is: **`52224`**.

## Commands & restrictions.

To see the full list of commands, use **`help`**.

Most of these commands are relevant with the site, unless `subscription`. Bot is having an alias trigger words, so no matter would you type `char` or `character` for request, anyway it will be queried correctly.

Every command is having its own description with examples, so you could use **`help command_name`**  for full description.
