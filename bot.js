import { config } from "dotenv"
import { readFileSync, writeFile, writeFileSync } from 'fs'

import { createTransport } from "nodemailer";

import { REST } from '@discordjs/rest';
import { API } from '@discordjs/core';
import { EmbedBuilder } from "discord.js";

config()

let data = JSON.parse(readFileSync('./data_template.json'))
let users = data['users']

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const api = new API(rest);


let transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})




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
export async function sendEmail(email, message) {
    let mailoptions = {
        from: 'closeyourwindow2024@gmail.com',
        to: email,
        subject: 'It\'s time to close your windows!',
        text: message
    }

    transporter.sendMail(mailoptions, function(error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
    return
}

export async function emailUsers() {
    users.forEach(user => {
        if (!user['emailNotifs']) {return}
        
        if (user.epoch < Date.now()) {
            message = 'Your ' + user.college + ' ' + user.roomType + ' has reached its desired temperature.'
            sendEmail(user.email, message)
        }

    })
}

/**
 * runs through user list and dms users if window state needs to be updated
 */
export async function dmUsers() {

    let data = JSON.parse(readFileSync('./data.json'))
    let users = data['users']
    console.log('Found users:', users)
    users.forEach(user => {
        if (!user?.username) return // No discord username submitted
        const embed = new EmbedBuilder()

        if (user.epoch < Date.now()) {
            console.log('Telling', user.username, 'to close their windows')
            embed.setAuthor({ name: 'Windows' })
                .setTitle(`It's time to close your windows!`)
                .setDescription(`Your ${user.college} ${user.roomType} room has reached its desired temperature.`)
            sendDM(user.username, embed)
            users = users.filter(u => u.username != user.username)
        } else console.log('Not telling', user.username, 'to close their windows')
    });

    data.users = users

    //update json
    writeFileSync('./data.json', JSON.stringify(data))
}

dmUsers()