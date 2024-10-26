// Function to log PresenceData from Local Storage
function logPresenceData() {
    const presenceData = localStorage.getItem('PresenceData');
    if (presenceData) {
        const presenceObject = JSON.parse(presenceData);
        const placeId = getPlaceIdFromUrl(); // Get the place ID from the URL

        // Print the entire PresenceData for debugging
        console.log('Checking... PresenceData:', presenceObject);

        // Check if the placeId exists in the PresenceData
        if (presenceObject && presenceObject[placeId]) {
            console.log(`Game ID ${placeId} is found in PresenceData. Starting playtime tracking...`);
            startTrackingPlaytime(placeId);
        } else {
            console.log(`Game ID ${placeId} is NOT found in PresenceData.`);
        }
    } else {
        console.log('No PresenceData found in Local Storage.');
    }
}

// Get the Place ID from the current URL
function getPlaceIdFromUrl() {
    const urlParts = window.location.href.split('/');
    return urlParts[urlParts.length - 1]; // The ID is assumed to be the last segment of the URL
}

// Start tracking playtime for the given placeId
let timer;
let playtime = 0;
let isPlaying = false;

function startTrackingPlaytime(placeId) {
    if (!isPlaying) {
        isPlaying = true;
        console.log(`Found Game ID ${placeId} in PresenceData. Starting playtime tracking...`);
        
        // Log playtime every second
        timer = setInterval(() => {
            playtime++;
            console.log(`Playtime: ${playtime} seconds`);
        }, 1000);

        // Check for presence data updates
        checkPresenceData(placeId);
    }
}

// Check for changes in PresenceData
function checkPresenceData(placeId) {
    const interval = setInterval(() => {
        const presenceData = localStorage.getItem('PresenceData');
        const presenceObject = presenceData ? JSON.parse(presenceData) : null;

        // Print the entire PresenceData for debugging
        console.log('Checking... PresenceData:', presenceObject);

        // Check if the placeId exists in the PresenceData
        if (!presenceObject || !presenceObject[placeId]) {
            // Stop tracking if the placeId is no longer in PresenceData
            clearInterval(interval);
            console.log(`Playtime tracking stopped. Total playtime: ${playtime} seconds.`);
            isPlaying = false;
            clearInterval(timer); // Stop the timer
        } else {
            console.log(`Game ID ${placeId} is still present in PresenceData. Continuing playtime tracking...`);
        }
    }, 1000);
}

// Check if the current URL matches the Roblox game URL format
const gameUrlPattern = /https:\/\/www\.roblox\.com\/games\/(\d+)/;

if (gameUrlPattern.test(window.location.href)) {
    console.log(`You are on a Roblox game page: ${window.location.href}`);
    // Start checking PresenceData every second while on the page
    setInterval(logPresenceData, 1000);
} else {
    console.log(`You are not on a Roblox game page. Current URL: ${window.location.href}`);
}





