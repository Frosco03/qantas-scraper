let {PythonShell} = require('python-shell');
const fs = require('fs');
const sendToPython = require('./renderer');

const formFields = [...document.querySelectorAll("[name]")];
const scrapeBtn = document.querySelector("#scrape-btn");
const exportBtn = document.querySelector("#export-btn");
const flightHeader = document.querySelector('#flights-header');

/** @type {HTMLTableElement} */
const table = document.querySelector("table#flights-table");
const tableBody = table.tBodies[0];


async function initialize() {
    const flyFromDropdown = document.querySelector("[name='flyFrom']");
    const flyToDropdown = document.querySelector("[name='flyTo']");

    // Map flight locations to dropdown option
    const flightLocationOptions = (await getFlightLocations()).map(location => `
        <option value="${location.id}">${location.name}</option>   
    `);

    flyFromDropdown.innerHTML = flightLocationOptions.join("");
    flyToDropdown.innerHTML = flightLocationOptions.join("");


}
initialize();

function collectFormValues() {
    const data = {};
    for(const formField of formFields) {
        data[formField.getAttribute("name")] = formField.value;
    }

    return data;
}

function gatherData(){
    return new Promise((resolve, reject) => {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if(err){
                console.error('Error reading the file:', err);
                reject(err);
            }
            try {
                jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (err) {
                console.error('Error parsing JSON:', err);
                reject(err);
            }
        }); 
    })  
}

function scrapeSite(data){
    const payload = JSON.stringify(data);
    let options = {
        args: [payload]
    };

    // return new Promise((resolve, reject) => {
    //     PythonShell.run('./src/scripts/main.py', options).then(results => {
    //         console.log(results);
    //         response = gatherData();
    //         resolve(response);
    //     });
    // })
    return new Promise((resolve, reject) => {
        window.sendToPython([payload]).then(results => {
            response = gatherData();
            resolve(response);
        })
    })
    
}

async function getFlightLocations() {
    return [
        { id: "GLT", name: "Gladstone" },
        { id: "BNE", name: "Brisbane" },
        { id: "SYD", name: "Sydney" },
        { id: "MEL", name: "Melbourne" },
        { id: "OOL", name: "Gold Coast" },
        { id: "HAN", name: "Hanoi" },
        { id: "DAD", name: "Da Nang" },
        { id: "SGN", name: "Ho Chi Minh City" },
        { id: "ADL", name: "Adelaide" },
        { id: "AUH", name: "Abu Dhabi" },
        { id: "AMD", name: "Ahmedabad" },
        { id: "AMM", name: "Amman" },
        { id: "AMS", name: "Amsterdam" },
        { id: "ESB", name: "Ankara" },
        { id: "ATH", name: "Athens" },
        { id: "ATL", name: "Atlanta" },
        { id: "AUS", name: "Austin" },
        { id: "BAH", name: "Bahrain" },
        { id: "DPS", name: "Bali - Denpasar" },
        { id: "BWI", name: "Baltimore" },
        { id: "BKK", name: "Bangkok" },
        { id: "BCN", name: "Barcelona" },
        { id: "PEK", name: "Beijing Capital" },
        { id: "BEY", name: "Beirut" },
        { id: "BEG", name: "Belgrade" },
        { id: "BLR", name: "Bengaluru" },
        { id: "BER", name: "Berlin" },
        { id: "BHX", name: "Birmingham" },
        { id: "BOS", name: "Boston" },
        { id: "BRU", name: "Brussels" },
        { id: "BUD", name: "Budapest" },
        { id: "CAI", name: "Cairo" },
        { id: "YYC", name: "Calgary" },
        { id: "CPT", name: "Cape Town" },
        { id: "CLT", name: "Charlotte" },
        { id: "MAA", name: "Chennai" },
        { id: "ORD", name: "Chicago O'hare" },
        { id: "CLE", name: "Cleveland" },
        { id: "CMB", name: "Colombo" },
        { id: "CPH", name: "Copenhagen" },
        { id: "DFW", name: "Dallas/Fort Worth" },
        { id: "DMM", name: "Dammam" },
        { id: "DEL", name: "Delhi" },
        { id: "DEN", name: "Denver" },
        { id: "DTW", name: "Detroit" },
        { id: "DAC", name: "Dhaka" },
        { id: "DOH", name: "Doha" },
        { id: "DUB", name: "Dublin" },
        { id: "DUR", name: "Durban" },
        { id: "DUS", name: "Dusseldorf" },
        { id: "EDI", name: "Edinburgh" },
        { id: "YEG", name: "Edmonton" },
        { id: "NAN", name: "Fiji - Nadi" },
        { id: "FLL", name: "Fort Lauderdale" },
        { id: "FRA", name: "Frankfurt" },
        { id: "FUK", name: "Fukuoka" },
        { id: "ELQ", name: "Gassim" },
        { id: "GVA", name: "Geneva" },
        { id: "CAN", name: "Guangzhou" },
        { id: "HIJ", name: "Hiroshima" },
        { id: "SGN", name: "Ho Chi Minh City" },
        { id: "HKG", name: "Hong Kong" },
        { id: "HNL", name: "Honolulu" },
        { id: "HOU", name: "Houston" },
        { id: "HYD", name: "Hyderabad" },
        { id: "IST", name: "Istanbul" },
        { id: "JED", name: "Jeddah" },
        { id: "JNB", name: "Johannesburg" },
        { id: "KHI", name: "Karachi" },
        { id: "KTM", name: "Kathmandu" },
        { id: "COK", name: "Kochi" },
        { id: "CCU", name: "Kolkata" },
        { id: "KUL", name: "Kuala Lumpur" },
        { id: "KWI", name: "Kuwait" },
        { id: "LHE", name: "Lahore" },
        { id: "LHR", name: "London Heathrow" },
        { id: "MAD", name: "Madrid" },
        { id: "MNL", name: "Manila" },
        { id: "MCT", name: "Muscat" },
        { id: "NRT", name: "Tokyo Narita" },
        { id: "ORD", name: "Chicago O'hare" },
        { id: "SYD", name: "Sydney" },
        { id: "MEL", name: "Melbourne" },
        { id: "BRU", name: "Brussels" },
        { id: "MXP", name: "Milan" },
        { id: "MUC", name: "Munich" },
        { id: "NBO", name: "Nairobi" },
        { id: "BNA", name: "Nashville" },
        { id: "MSY", name: "New Orleans" },
        { id: "LGA", name: "New York Laguardia" },
        { id: "EWR", name: "New York/Newark" },
        { id: "NCE", name: "Nice" },
        { id: "OIT", name: "Oita" },
        { id: "OKA", name: "Okinawa" },
        { id: "MCO", name: "Orlando" },
        { id: "ITM", name: "Osaka Itami" },
        { id: "KIX", name: "Osaka Kansai" },
        { id: "OSL", name: "Oslo" },
        { id: "YOW", name: "Ottawa" },
        { id: "CDG", name: "Paris" },
        { id: "PEN", name: "Penang" },
        { id: "PER", name: "Perth" },
        { id: "PEW", name: "Peshawar" },
        { id: "PHL", name: "Philadelphia" },
        { id: "PNH", name: "Phnom Penh" },
        { id: "PHX", name: "Phoenix" },
        { id: "HKT", name: "Phuket" },
        { id: "PDX", name: "Portland - Oregon" },
        { id: "PRG", name: "Prague" },
        { id: "RDU", name: "Raleigh/Durham" },
        { id: "RUH", name: "Riyadh" },
        { id: "ROK", name: "Rockhampton" },
        { id: "FCO", name: "Rome" },
        { id: "SMF", name: "Sacramento" },
        { id: "SLC", name: "Salt Lake City" },
        { id: "APW", name: "Samoa - Apia" },
        { id: "SAN", name: "San Diego" },
        { id: "SFO", name: "San Francisco" },
        { id: "SNA", name: "Santa Ana" },
        { id: "CTS", name: "Sapporo" },
        { id: "SEA", name: "Seattle" },
        { id: "ICN", name: "Seoul Incheon" },
        { id: "PVG", name: "Shanghai Pudong" },
        { id: "SKT", name: "Sialkot" },
        { id: "SAI", name: "Siem Reap" },
        { id: "SIN", name: "Singapore" },
        { id: "STL", name: "St Louis" },
        { id: "ARN", name: "Stockholm" },
        { id: "TIF", name: "Taif" },
        { id: "TPA", name: "Tampa" },
        { id: "HND", name: "Tokyo Haneda" },
        { id: "YYZ", name: "Toronto Pearson" },
        { id: "TLS", name: "Toulouse" },
        { id: "YVR", name: "Vancouver" },
        { id: "VLI", name: "Vanuatu - Port Vila" },
        { id: "VIE", name: "Vienna" },
        { id: "WAW", name: "Warsaw" },
        { id: "IAD", name: "Washington Dulles" },
        { id: "DCA", name: "Washington Reagan" },
        { id: "YWG", name: "Winnipeg" },
        { id: "ZAG", name: "Zagreb" },
        { id: "ZRH", name: "Zurich" }
    ];
}

/**
 * @typedef {[ number, number ]} RewardItem
 * @param {{ date, routes: { num, fromTime, fromLocation, toTime, toLocation, duration }[ ], rewards: { economy: RewardItem, premium: RewardItem, business: RewardItem, first: RewardItem } }[]} flights 
 */
function setTableValues(flights, origin, destination) {
    // Clear table values
    tableBody.innerHTML = "";

    //Change header
    flightHeader.innerHTML = `${origin} to ${destination}`;

    // Map flight items into table rows
    for(const flight of flights) {
        // Map flight routes
        const flightRouteElements = flight.routes.map(route => 
            `<div class="flight-route-item">
                  <span class="flight-route-no">${route.flightNo}</span>
                  <div class="flight-route-stop">
                    <span class="flight-route-stop-time">${route.departureTime}</span>
                    <span class="flight-route-stop-location">${route.origin}</span>
                  </div>
                  <div class="flight-route-duration">
                    #Placeholder#
                  </div>
                  <div class="flight-route-stop">
                    <span class="flight-route-stop-time">${route.arrivalTime}</span>
                    <span class="flight-route-stop-location">${route.destination}</span>
                  </div>
                
              </div>`
        );

        const flightRewardsElements = [ 
            flight.rewards.economyReward,
            flight.rewards.premEconomyReward,
            flight.rewards.businessReward,
            flight.rewards.firstReward
         ].map(rewards => rewards ? `
            <td>
                <div class="flight-rewards">
                    <span class="flight-rewards-1">${rewards[0]}</span>
                    <span class="flight-rewards-2">${rewards[1]}</span>
                </div>
            </td>
        ` : `<td></td>`);

        const row = `<tr>
            <td>July 17, 2024</td>
            <td>
              <div class="flight-routes">
                ${flightRouteElements.join("")}
              </div></td>
            ${flightRewardsElements.join("")}
          </tr>`;

        tableBody.innerHTML += row;
    }
}

function onScrape() {
    const data = collectFormValues();
    const scrape = scrapeSite(data);
    //Obtain scraped data
    scrape.then(scraped => {
        //Set table values from scraped data
        setTableValues(scraped, data['flyFrom'], data['flyTo']);
    });
}

function onExport() {
    // TODO: Create CSV file
}

scrapeBtn.addEventListener("click", onScrape);
exportBtn.addEventListener("click", onExport);