import { config } from "dotenv"
import { readFileSync, writeFile, writeFileSync } from 'fs'

//import email stuff 

import { REST } from '@discordjs/rest';
import { API } from '@discordjs/core';
import { EmbedBuilder } from "discord.js";

config()

let data = JSON.parse(readFileSync('./data_template.json'))
let users = data['users']

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const api = new API(rest);


/**
 * send dm given username
 * @param {string} globalName 
 * @param {EmbedBuilder} embed 
 */
export async function sendDM(globalName, embed) {
    const allMembers = await api.guilds.getMembers(process.env.GUILD_ID, { limit: 100 });

    const member = allMembers.filter(member => member.user.username === globalName)[0];

    const DMChannel = await api.users.createDM(member.user.id);

    await api.channels.createMessage(DMChannel.id, { embeds: [embed] });
}

/**
 * send email given email addr
 * @param {string} email email addr
 * @param {string} action either 'open' or 'close'
 */
export async function sendEmail(email, action) {
    users.forEach(user => {
        if (!user['emailNotifs']) return
    })
    return
}

/**
 * runs through user list and dms users if window state needs to be updated
 */
export async function dmUsers() {

    let data = JSON.parse(readFileSync('./data.json'))
    let users = data['users']

    users.forEach(user => {
        if (!user['discordNotifs']) return

        const embed = new EmbedBuilder()

        if (user['windowOpenEpoch'] <= Date.now() || user['windowCloseEpoch'] <= Date.now()) {
            let action = (user['windowOpenEpoch'] <= Date.now()) ? 'close' : 'open'

            embed.addFields([{ name: action + " ur windows", value: "!!!" }])
            sendDM(user['discordUsername'], embed)
        }
        

        if (user['windowOpenEpoch'] <= Date.now()) {
            user['windowOpenEpoch'] = '99999999999999999999'
        }
        if (user['windowCloseEpoch'] <= Date.now()) {
            user['windowCloseEpoch'] = '99999999999999999999'
        }

        user['windowOpen'] = !user['windowOpen']
    });

    data['users'] = users

    //update json
    writeFileSync('./data.json', JSON.stringify(data))
}

dmUsers()