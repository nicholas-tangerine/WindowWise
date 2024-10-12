import config from "./calculator_config.json" with { type: "json" };


/** Time step for numerical integration, in seconds. */
const DELTA_TIME = 1.0;
/** Maximum time for calculateTime to return, in seconds. */
const MAX_COMPUTED_TIME = 86400.0;
/** Heat capacity of air, in J/kg*K */
const HEAT_CAPACITY = 1005.0;
/** Heat transfer of air, in W/m^2*K */
const HEAT_TRANSFER_COEFF = 10.0;


/**
 * Calculates the time to leave windows open for to achieve a target temperature.
 *
 * @param currentTemp   the current temperature inside the room, in degrees celsius.
 * @param targetTemp    the target temperature of the room, in degrees celsius
 * @param latitude      the latitude of the room.
 * @param longitude     the longitude of the room.
 * @param roomVolume    the volume of the room, in cubic meters.
 * @param windowArea    the area of the open window, in square meters.
 * @param percentError  the acceptable percentage error from the target temperature, default 10%.
 *
 * @return a structure containing the time to leave the window open (`time`) and the final
 *         temperature reached after that time (`finalTemp`).
 */
async function calculateTime(currentTemp,
                             targetTemp,
                             latitude,
                             longitude,
                             roomVolume,
                             windowArea,
                             percentError = 0.1)
{
    let now = new Date();
    let weatherData = await getWeatherData(latitude, longitude);

    for (let t = 0.0; t < MAX_COMPUTED_TIME; t += DELTA_TIME) {
        let outsideTemp = getDataValue(now, weatherData, "temp");
        let airPressure = getDataValue(now, weatherData, "pressure");
        let airDensity = getDensity(airPressure, outsideTemp);
        let heatTransferRequired = HEAT_TRANSFER_COEFF * windowArea * (outsideTemp - currentTemp);
        let heatTransfer = roomVolume * airDensity * HEAT_CAPACITY;
        currentTemp += (heatTransferRequired * DELTA_TIME) / heatTransfer;

        if (isAcceptableTemp(currentTemp, targetTemp, percentError)) {
            return {
                time: t,
                finalTemp: currentTemp
            }
        }

        now.setSeconds(now.getSeconds() + DELTA_TIME);
    }

    return undefined;
}


/**
 * Determines whether the current temperature is acceptably close to the target temperature.
 *
 * @param currentTemp   the current temperature, in degrees celsius.
 * @param targetTemp    the target temperature, in degrees celsius
 * @param percentError  the acceptable percentage error from the target temperature
 *
 * @return whether the current temperature is acceptably close to the target temperature.
 */
function isAcceptableTemp(currentTemp, targetTemp, percentError) {
    let deviation = percentError * targetTemp;
    let lowerBound = targetTemp - deviation;
    let upperBound = targetTemp + deviation;
    return currentTemp >= lowerBound && currentTemp <= upperBound;
}


/**
 * Gets the density of the air in kg/m^3.
 *
 * @param airPressure  the pressure of the air in hPa.
 * @param airTemp      the temperature of the air in C.
 *
 * @return the density of the air in kg/m^3.
 */
function getDensity(airPressure, airTemp) {
    let airPressurePa = 100 * airPressure;
    let airTempK = airTemp + 273.15;
    let rSpecific = 287.052874;
    return airPressurePa / (rSpecific * airTempK);
}


/**
 * Gets a specific type of weather data for the measurement closest to a specific time.
 *
 * @param time         the time to get the value for.
 * @param weatherData  the weather data to choose from.
 * @param valueName    the name of the value to get.
 *
 * @return the value for the measurement taken closest to the specified time.
 */
function getDataValue(time, weatherData, valueName) {
    let currentTime = Math.floor(time.getTime() / 1000);
    let closestTime = Infinity;
    let closestValue = NaN;

    for (const dataEntry of weatherData) {
        let timeDifference = Math.abs(currentTime - dataEntry.dt);
        if (timeDifference < closestTime) {
            closestTime = timeDifference;
            closestValue = dataEntry.main[valueName];
        }
    }

    return closestValue;
}


/**
 * Gets weather forecast data at a specified location.
 *
 * @param latitude   the latitude of the location.
 * @param longitude  the longitude of the location.
 *
 * @return the weather data.
 */
async function getWeatherData(latitude, longitude) {
    let endpoint = getWeatherEndpoint(latitude, longitude);
    let weatherData;
    await fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            weatherData = data.list;
        })
        .catch((error) => {
            console.error(error);
        });
    return weatherData;
}


/**
 * Gets the API endpoint for OpenWeatherMap for a specific location.
 *
 * @param latitude   the latitude of the location.
 * @param longitude  the longitude of the location.
 *
 * @return a string representing the API endpoint to use.
 */
function getWeatherEndpoint(latitude, longitude) {
    return "https://api.openweathermap.org/data/2.5/forecast?" +
	"lat=" + latitude + "&" +
	"lon=" + longitude + "&" +
	"units=metric&" +
	"appid=" + config.OpenWeatherMapKey;  // MARK: no hard coded key
}
