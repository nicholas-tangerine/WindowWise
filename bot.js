import { config } from "dotenv"
import { readFileSync, writeFile } from 'fs'



import { REST } from '@discordjs/rest';
import { API } from '@discordjs/core';
import { EmbedBuilder } from "discord.js";

config()

const time = Date.now()

let data = JSON.parse(readFileSync('./data_template.json'))
let users = data['users']

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const api = new API(rest);

const guildID = '1294533411205152858'
const globalName = 'wqnderalone'

/**
 * 
 * @param {string} globalName 
 * @param {EmbedBuilder} embed 
 */
export async function sendDM(globalName, embed) {
    const allMembers = await api.guilds.getMembers(guildId, { limit : 100 });
    
    const member = allMembers.filter(member => member.user.username === globalName)[0];

    const DMChannel = await api.users.createDM(member.user.id);

    await api.channels.createMessage(DMChannel.id, { embeds: [embed] });
}

export async function sendEmail(email, action) {
    users.forEach(user => {
        if (!user['emailNotifs']) {return}
    })
    return
}

// check if user needs to be pinged
export async function dmUsers() {
    users.forEach(user => {
        if (!user['discordNotifs']) {return}

        const embed = new EmbedBuilder()

        if (user['windowOpenEpoch'] <= time || user['windowCloseEpoch'] <= time) {
            let action = (user['windowOpenEpoch'] <= time) ? 'close' : 'open'
            
            embed.addFields([ {name : action + "ur windows", value : "!!!"} ])
            sendDM(user['discordUsername'], embed)
        }

        user['windowEpoch'] = '99999999999999999999'
        user['windowOpen'] = !user['windowOpen']
    });

    data['users'] = users

    //update json
    writeFile('./data_template.json', JSON.stringify(data))
}
