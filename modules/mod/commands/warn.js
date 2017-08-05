const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
  help: "Warn a user.",
  example: "${p}warn @Funnbot please don't do that.",
  argExample: "<user> <reason>",
  dm: false,
  coolDown: 1,
  botPerms: [],
  userPerms: 1,
  args: [],

  run: async (message, bot, send) => {
    if (!message.checkSuffix) return send("**Example: " + module.exports.example.replace("${p}", message.prefix) + "**")
    let user = message.args[0]
    let reason = message.suffixOf(1).length > 0 ? message.suffixOf(1).trim() : false
    let member = await message.parseMember(user)
    if (!member) return send("**Could not find the user: **" + user)
    send("**Warning user...**").then(async msg => {
      let t = `**You have been warned in ${message.guild.name}**\n\n**Reason:** ${reason || "None"}`
      try {
        await member.send(t)
      } catch (err) {
        send(t)
        console.log(err)
      }
      try {
        let caseman = message.guild.check("caseman")
        if (!caseman) throw new Error("CaseManager was not initialized.")
        caseman.newCase(message.author, member.user, "warn", {reason: reason})
        msg.edit("**Warn complete**")
      } catch (err) {
        console.log(err)
        send("**I was unable to warn the user:** " + member.user.tag)
      }
    })
  }
})
