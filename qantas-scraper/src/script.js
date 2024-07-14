

const formFields = [...document.querySelectorAll("[name]")];
const scrapeBtn = document.querySelector("#scrape-btn");
const exportBtn = document.querySelector("#export-btn");

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

async function getFlightLocations() {
    return [
        { id: "MNL", name: "Manila" },
        { id: "LAX", name: "Los Angeles" }
    ];
}

/**
 * @typedef {[ number, number ]} RewardItem
 * @param {{ date, routes: { num, fromTime, fromLocation, toTime, toLocation, duration }[ ], rewards: { economy: RewardItem, premium: RewardItem, business: RewardItem, first: RewardItem } }[]} flights 
 */
function setTableValues(flights) {
    // Clear table values
    tableBody.innerHTML = "";

    // Map flight items into table rows
    for(const flight of flights) {
        // Map flight routes
        const flightRouteElements = flight.routes.map(route => 
            `<div class="flight-route-item">
                  <span class="flight-route-no">${route.num}</span>
                  <div class="flight-route-stop">
                    <span class="flight-route-stop-time">${route.fromTime}</span>
                    <span class="flight-route-stop-location">${route.fromLocation}</span>
                  </div>
                  <div class="flight-route-duration">
                    ${route.duration}
                  </div>
                  <div class="flight-route-stop">
                    <span class="flight-route-stop-time">${route.toTime}</span>
                    <span class="flight-route-stop-location">${route.toLocation}</span>
                  </div>
                
              </div>`
        );

        const flightRewardsElements = [ 
            flight.rewards.economy,
            flight.rewards.premium,
            flight.rewards.business,
            flight.rewards.first
         ].map(rewards => rewards ? `
            <td>
                <div class="flight-rewards">
                    <span class="flight-rewards-1">${rewards[0]}</span>
                    <span class="flight-rewards-2">${rewards[0]}</span>
                </div>
            </td>
        ` : `<td></td>`);

        const row = `<tr>
            <td>${flight.date}</td>
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

    // TODO: Process form data
    // Sample:
    // {
    //     "flyFrom": "MNL",
    //     "flyTo": "LAX",
    //     "dateFrom": "2024-07-10",
    //     "dateTo": "2024-07-11",
    //     "guestsAdults": "2",
    //     "guestsChildren": "3",
    //     "guestsInfants": "4"
    // }

    // TODO: Obtain scraped data

    // TODO: Set table values from scraped data


    // -------------------- SAMPLE -----------------
    const scraped = [
        { 
            date: "1 January 2024", 
            routes: [{ 
                num: "ABC123", 
                fromTime: "01:00", 
                fromLocation: "Manila", 
                toTime: "03:00", 
                toLocation: "Los Angeles", 
                duration: "20h 10m" 
            }], 
            rewards: { 
                economy: [ "1,000", "+200" ], 
                premium: null, 
                business: [ "3,000", "+600" ], 
                first: null
            }
        },
        { 
            date: "2 January 2024", 
            routes: [
                { 
                    num: "ABC123", 
                    fromTime: "01:00", 
                    fromLocation: "Manila", 
                    toTime: "02:00", 
                    toLocation: "New York", 
                    duration: "17h 05m" 
                },
                { 
                    num: "ABC124", 
                    fromTime: "02:00", 
                    fromLocation: "New York", 
                    toTime: "03:00", 
                    toLocation: "Los Angeles", 
                    duration: "3h 02m" 
                }
            ], 
            rewards: { 
                economy: null, 
                premium: [ "2,000", "+400" ], 
                business: null, 
                first: [ "4,000", "+800" ]
            }
        }
    ];

    setTableValues(scraped);
}

function onExport() {
    // TODO: Create CSV file
}

scrapeBtn.addEventListener("click", onScrape);
exportBtn.addEventListener("click", onExport);