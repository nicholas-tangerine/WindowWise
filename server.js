import express from 'express';
import bodyParser from 'body-parser';
import { readFileSync, writeFile, writeFileSync } from 'fs'
import { calculateTime } from './calculator.js'
import { getDormParameters } from './dorms.js'
import { dmUsers, sendDM, sendEmail } from './bot.js'
import { config } from "dotenv"
config()

// Initialize express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint for testing
app.get('/', (req, res) => {
    res.json({ 'hello': 'world' })
})

/**
 * Parses college name to enum
 * 
 * @param {string} college  The college name
 * @return
 */
function collegeToEnum(college) {
    switch (college.trim()) {
        case 'Cowell':
            return 0;
        case 'Stevenson':
            return 1;
        case 'Crown':
            return 2;
        case 'Merrill':
            return 3;
        case 'College Nine':
            return 4;
        case 'John R. Lewis':
            return 5;
        case 'Porter':
            return 6;
        case 'Kresge':
            return 7;
        case 'Oakes':
            return 8;
        case 'Rachel Carson':
            return 9;
    }
}
function roomToEnum(roomType) {
    switch (roomType.trim()) {
        case 'Single':
            return 0;
        case 'Double':
            return 1;
        case 'Triple':
            return 2;
        case 'Large Triple':
            return 3;
    }
}

// API endpoint for submitting data
// POST http://localhost:PORT/api/v1/submit
app.post('/api/v1/submit', async (req, res) => {
    const { discordUsername, email, currentTemp, targetTemp, college, roomType } = req.body;

    const dormParameters = getDormParameters(collegeToEnum(college), roomToEnum(roomType));
    console.log(currentTemp, targetTemp, dormParameters.latitude, dormParameters.longitude, dormParameters.roomVolume, dormParameters.windowArea)
    const result = await calculateTime(currentTemp, targetTemp, dormParameters.latitude, dormParameters.longitude, dormParameters.roomVolume, dormParameters.windowArea, 0.01)
    console.log(result)

    // Fetch user data
    let data = await JSON.parse(readFileSync('./data.json'))

    // Check if user already exists to eliminate duplicates, if so return error
    if (data.users?.filter(user => user.discordUsername === discordUsername).length)
        return res.json({ success: false, error: 'User already exists' })

    // Add user to data
    data.users.push({
        lat: dormParameters.latitude,
        long: dormParameters.longitude,
        hour: 0,
        minute: 0,
        windowOpen: true,
        email: email ?? null,
        emailNotifs: !!email,
        discordUsername: discordUsername ?? null,
        discordNotifs: !!discordUsername,
        windowOpenEpoch: Date.now(),
        windowCloseEpoch: result.time * 1000
    })

    // Write data to file
    writeFileSync('./data.json', JSON.stringify(data))

    // Send final time back to client
    res.json({
        success: true,
        data: result
    })
})

// Check if user needs to be notified every 15s
setInterval(() => {
    dmUsers()
}, 15_000);


// Run API on http://localhost:PORT
app.listen(process.env.PORT_SERVER, () => {
    console.log(`Server is running on port ${process.env.PORT_SERVER}`);
})