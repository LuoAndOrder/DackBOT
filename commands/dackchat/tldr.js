const commando = require('discord.js-commando');
const rp = require('request-promise');
const discord = require('discord.js');

const tldr = async (url, msg) => {
  try {
    var response = await rp({
      uri: `https://api.smmry.com/SM_API_KEY=${process.env.SMMRY_API_KEY}&SM_LENGTH=5&SM_WITH_BREAK&SM_URL=${url}`,
      method: 'POST'
    });
  } catch (err) {
    console.log(err);
  }

  console.log(response);
  let {sm_api_title, sm_api_content, sm_api_content_reduced, sm_api_limitation} = JSON.parse(response);
  let channel = msg.channel;
  let contentWithNewlines = sm_api_content.replace(/\[BREAK\]/g, '\n');
  let richEmbed = new discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle(sm_api_title)
    .setURL(url)
    .setFooter(`Content reduced by ${sm_api_content_reduced}`)
    .setDescription(contentWithNewlines);
  channel.send(richEmbed);
  console.log(sm_api_limitation);
}

module.exports = class TldrCommand extends commando.Command {
  constructor(client) {
    console.log("Registering TLDR command...");
    super(client, {
      name: 'tldr',
      aliases: ['tldr'],
      group: 'dackchat',
      memberName: 'tldr',
      description: 'Provides a tldr of an article',
      examples: ['tldr https://example.com/article/foo'],
      args: [
        {
          key: 'url',
          label: 'url',
          prompt: 'What url do you want to summarize?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, {url}) {
    console.log("Bot detected tldr command from " + msg.author);
    return await tldr(url, msg);
  }
}