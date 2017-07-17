const Discord = require("discord.js")
const DatabaseManager = require("./DatabaseManager.js")
const Status = require("./Status.js")
const ClientExtension = require("../extensions/ClientExtension.js")
const MessageExtension = require("../extensions/MessageExtension.js")
const MessageEmbedExtension = require("../extensions/MessageEmbedExtension.js")
const ChannelExtension = require("../extensions/ChannelExtension.js")
const UserExtension = require("../extensions/UserExtension.js")
const GuildExtension = require("../extensions/GuildExtension.js")
const Sentry = require("raven")

ClientExtension.extend(Discord.Client)
MessageExtension.extend(Discord.Message)
MessageEmbedExtension.extend(Discord.MessageEmbed)
ChannelExtension.extend(Discord.Channel)
UserExtension.extend(Discord.User)
GuildExtension.extend(Discord.Guild)

const { TOKEN, SENTRY } = require("../config.js")

global.Nitro = {}

require("./Command.js")
require("./CommandLoader.js")
require("./CoolDown.js")
require("./PermissionHandler.js")
require("./ArgumentHandler")
require("./util.js")
require("./Alias.js")

class Client {

  constructor(key, opt = {}) {

    opt.disabledEvents = ["TYPING_START"]
    this.bot = new Discord.Client(opt)
    this.bot.embed = Discord.MessageEmbed
    this.bot.module = key

    Sentry.config(SENTRY).install()
    this.bot.sentry = Sentry

    this.bot.active = {}

    this.bot.on("ready", () => {
      console.log(`${key} bot online`)
      Status.start(this.bot)
    })
    process.on("unhandledRejection", (err) => this.bot.logger.error(err.stack))

  }

  database(keys = []) {
    keys.push("prefix", "alias", "perms", "roles")
    for (let db of keys) {
      this.bot[db] = new DatabaseManager(db)
    }
  }

  login() {
    this.bot.login(TOKEN).catch(console.log)
  }
}

module.exports = Client