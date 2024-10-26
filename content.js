// Initialize timer and playtime
let timer;
let playtime = 0;
let points = parseInt(localStorage.getItem('points')) || 0; // Load points from localStorage
let isPlaying = false;

// Function to log PresenceData from Local Storage
function logPresenceData() {
    const presenceData = localStorage.getItem('PresenceData');
    if (presenceData) {
        const presenceObject = JSON.parse(presenceData);
        const gameId = getGameIdFromUrl(); // Get the game ID from the URL

        // Print the entire PresenceData for debugging
        console.log('Checking... PresenceData:', presenceObject);

        // Check if the gameId exists in the PresenceData
        let isMatchFound = false;

        for (const userId in presenceObject) {
            if (presenceObject.hasOwnProperty(userId)) {
                const userPresence = presenceObject[userId].data;
                const placeId = userPresence.placeId;

                // Log the checking condition
                console.log(`Checking... Game ID "${gameId}" with Data "Place ID: ${placeId}"`);

                if (placeId.toString() === gameId) {
                    isMatchFound = true;
                    console.log(`Game ID "${gameId}" matches Place ID "${placeId}". Starting playtime tracking...`);
                    startTrackingPlaytime(gameId);
                    break;
                }
            }
        }

        if (!isMatchFound) {
            console.log(`Game ID "${gameId}" is NOT found in PresenceData.`);
        }
    } else {
        console.log('No PresenceData found in Local Storage.');
    }
}

// Get the Game ID from the current URL
function getGameIdFromUrl() {
    const urlParts = window.location.href.split('/');
    return urlParts[4]; // The ID is assumed to be the 4th segment of the URL
}

// Start tracking playtime for the given gameId
function startTrackingPlaytime(gameId) {
    if (!isPlaying) {
        isPlaying = true;
        console.log(`Found Game ID "${gameId}" in PresenceData. Starting playtime tracking...`);
        
        // Log playtime every second
        timer = setInterval(() => {
            playtime++;
            console.log(`Playtime: ${playtime} seconds`);
        }, 1000);

        // Check for presence data updates
        checkPresenceData(gameId);
    }
}

// Check for changes in PresenceData
function checkPresenceData(gameId) {
    const interval = setInterval(() => {
        const presenceData = localStorage.getItem('PresenceData');
        const presenceObject = presenceData ? JSON.parse(presenceData) : null;

        // Print the entire PresenceData for debugging
        console.log('Checking... PresenceData:', presenceObject);

        // Check if the gameId exists in the PresenceData
        let isStillPresent = false;

        if (presenceObject) {
            for (const userId in presenceObject) {
                if (presenceObject.hasOwnProperty(userId)) {
                    const userPresence = presenceObject[userId].data;
                    const placeId = userPresence.placeId;

                    // Log the checking condition
                    console.log(`Checking... Game ID "${gameId}" with Data "Place ID: ${placeId}"`);

                    if (placeId && placeId.toString() === gameId) {
                        isStillPresent = true;
                        console.log(`Game ID "${gameId}" is still present in PresenceData.`);
                        break;
                    }
                }
            }
        }

        if (!isStillPresent) {
            // Stop tracking if the gameId is no longer in PresenceData
            clearInterval(interval);
            console.log(`Playtime tracking stopped. Total playtime: ${playtime} seconds.`);
            points += playtime; // Add playtime to points
            localStorage.setItem('points', points); // Save points to localStorage
            console.log(`You earned ${playtime} points! Total Points: ${points}`);
            isPlaying = false;
            clearInterval(timer); // Stop the timer
        }
    }, 1000);
}

// Check if the current URL matches the Roblox game URL format
const gameUrlPattern = /https:\/\/www\.roblox\.com\/games\/(\d+)/;
const pointsUrlPattern = /https:\/\/www\.roblox\.com\/Points/;

// Check if we are on the Points page to log points every second
if (pointsUrlPattern.test(window.location.href)) {
    setInterval(() => {
        console.log(`Total Points: ${points}`);
    }, 1000);
} else if (gameUrlPattern.test(window.location.href)) {
    console.log(`You are on a Roblox game page: ${window.location.href}`);
    // Start checking PresenceData every second while on the page
    setInterval(logPresenceData, 1000);
} else {
    console.log(`You are not on a Roblox game page. Current URL: ${window.location.href}`);
}




