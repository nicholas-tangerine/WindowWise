import { config } from "dotenv";
config()

/** The height of a dorm ceiling, in meters. */
const CEILING_HEIGHT = 2.4384;
/** The height of a dorm window, in meters. */
const WINDOW_HEIGHT = 2.134;


/** Enumeration type for UCSC residential college. */
const College = {
    COWELL: 0,
    STEVENSON: 1,
    CROWN: 2,
    MERRILL: 3,
    COLLEGE_NINE: 4,
    JOHN_R_LEWIS: 5,
    PORTER: 6,
    KRESGE: 7,
    OAKES: 8,
    RACHEL_CARSON: 9
};


/** Enumeration type for UCSC dorm room format. */
const RoomType = {
    SINGLE: 0,
    DOUBLE: 1,
    TRIPLE: 2,
    LARGE_TRIPLE: 3
};


/**
 * Returns location and geometric parameters for a dorm room at a UCSC residential college.
 *
 * @param college   the residential college as a `College` enumeration.
 * @param roomType  the type of room as a `RoomType` enumeration.
 *
 * @return an object containting the latitude, longitude, room volume, and window area.
 */
export function getDormParameters(college, roomType) {
    let locationParameters = getLocationByCollege(college);
    let roomParameters = getRoomParameters(roomType);
    return { ...locationParameters, ...roomParameters };
}


/**
 * Returns location and geometric parameters for an arbitrary address.
 *
 * @param address     the written address of the room.
 * @param roomVolume  the volume of the room, in cubic meters.
 * @param windowArea  the area of the open window, in square meters.
 *
 * @return an object containting the latitude, longitude, room volume, and window area.
 */
async function getAddressParamters(address, roomVolume, windowArea) {
    let locationParameters = await getLocationByAddress(address);
    let roomParamters = { roomVolume: roomVolume, windowArea: windowArea };
    return { ...locationParameters, ...roomParameters };
}


/**
 * Returns the location of the specified UCSC residential college.
 *
 * @param college  the residential college as a `College` enumeration.
 *
 * @return an object containing the latitude and longitude of the college.
 */
function getLocationByCollege(college) {
    switch (college) {
        case College.COWELL:
            return { latitude: 36.99726734074804, longitude: -122.05423661731234 };
        case College.STEVENSON:
            return { latitude: 36.99706194303461, longitude: -122.0519205634501 };
        case College.CROWN:
            return { latitude: 37.00031637845457, longitude: -122.05448116395414 };
        case College.MERRILL:
            return { latitude: 36.999963786354435, longitude: -122.05329464903268 };
        case College.COLLEGE_NINE:
            return { latitude: 37.001655220261696, longitude: -122.05728241260152 };
        case College.JOHN_R_LEWIS:
            return { latitude: 37.00074698072326, longitude: -122.05853493213417 };
        case College.PORTER:
            return { latitude: 36.99438286274733, longitude: -122.06524433080737 };
        case College.KRESGE:
            return { latitude: 36.99739927086994, longitude: -122.06655489160133 };
        case College.OAKES:
            return { latitude: 36.98957833602917, longitude: -122.0629012398393 };
        case College.RACHEL_CARSON:
            return { latitude: 36.99126142741995, longitude: -122.06464850197234 };
        default:
            throw new Error("Unknown UCSC residential college '" + college + "'");
    }
}


/**
 * Returns geometric information about the specific dorm room type.
 *
 * @param roomType  the type of the dorm room as a `RoomType` enumeration.
 *
 * @return an object containing the volume of the room and the area of its window(s).
 */
function getRoomParameters(roomType) {
    switch (roomType) {
        case RoomType.SINGLE:
            return { roomVolume: 7.892 * CEILING_HEIGHT, windowArea: 1.118 * WINDOW_HEIGHT };
        case RoomType.DOUBLE:
            return { roomVolume: 11.47 * CEILING_HEIGHT, windowArea: 1.651 * WINDOW_HEIGHT };
        case RoomType.TRIPLE:
            return { roomVolume: 15.71 * CEILING_HEIGHT, windowArea: 1.651 * WINDOW_HEIGHT };
        case RoomType.LARGE_TRIPLE:
            return { roomVolume: 20.82 * CEILING_HEIGHT, windowArea: 2.438 * WINDOW_HEIGHT };
    }
}


/**
 * Returns the location of an address.
 *
 * @param address  a written address.
 *
 * @return an object containing the latitude and longitude of the address. If the address cannot
 *         be found, `undefined` is returned.
 */
async function getLocationByAddress(address) {
    let endpoint = getGeocoderEndpoint(address);
    let addressData;
    await fetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
            let results = data.results;
            if (results.length > 0) {
                let location = results[0].geometry.location;
                addressData = { latitude: location.lat, longitude: location.lng };
            }
        })
        .catch((error) => {
            console.error(error);
        });
    return addressData;
}


/**
 * Returns the endpoint for a Google Geocoder API call at a specified address.
 *
 * @return the Geocoder API endpoint for the specified address.
 */
function getGeocoderEndpoint(address) {
    return "https://maps.googleapis.com/maps/api/geocode/json?" +
        "address=" + address + "&" +
        "key=" + process.env.GEOCODER_KEY;
}
