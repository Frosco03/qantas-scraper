const { Builder, Browser, By, Capabilities, until, Options } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

const scrapeSite = async () => {
    /*TODO: Keep trying to retry the connection kung walang nakuha na data
    Save the resonse data in a file
    Sort through the data that matches origin and destination
    Sort by date
    */

    const options = new Chrome.Options();
    const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    options.addArguments('--window-size=0,0');
    //options.addArguments(`--headless=new`);
    options.setLoggingPrefs({ browser: 'ALL' });

    const capabilities = Capabilities.chrome();
    capabilities.set('goog:loggingPrefs', { browser: 'ALL' });

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .withCapabilities(capabilities)
        .build();

    // Set browser window position off-screen
    await driver.manage().window().setRect({x: 0, y: -1000}); // Move the window off-screen

    // Navigate to the webpage
    await driver.get('https://seats.aero/qantas?originRegion=Asia&destinationRegion=Anywhere');

    await driver.executeScript('document.title = "Getting flight information..."');

    // Enable network logging
    await driver.manage().logs().get('browser');

    // Trigger a fetch request on the page
    await driver.executeScript(() => {
        fetch('https://seats.aero/_api/availability_table_modern?origin_region=Asia&destination_region=Anywhere&route=&origin_airport=&destination_airport=&carrier=&source=qantas&ex=false&giga=false&min_seats=1&direct_only=false')
        .then(response => response.json())
        .then(data => console.log('Fetched data:', JSON.stringify(data)))
        .catch(error => console.error('Fetch error:', error));
    });

    // Wait for some time to allow network logs to capture fetch request
    await driver.sleep(5000);

    // Get network logs
    const logs = await driver.manage().logs().get('browser');
    logs.forEach(log => {
        if (log.message.includes('Fetch')) {
            fs.writeFile("fetch.json", log.message, function(err) {
                if(err){
                    console.log(err);
                }
            })
            console.log('Fetch request intercepted:', log.message);
        }
    });

    driver.quit();
}

document.addEventListener('click', scrapeSite);