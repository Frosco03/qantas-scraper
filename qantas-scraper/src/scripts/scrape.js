const { Builder, Browser, By, Key, until, Options } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

function submitForm(){
    axios.request(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log(error);
    });

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Debug function to take screenshot while on headless mode
const screenshot = (driver) => {
  driver.takeScreenshot().then(function(data){
    var base64Data = data.replace(/^data:image\/png;base64,/,"")
    fs.writeFile("out.png", base64Data, 'base64', function(err) {
         if(err) console.log(err);
    });
  });
}

const fillDummyDetails = async (driver) => {
  await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/div/button')).click();

  //We only fill destField because origin is already set
  let destField = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[1]/input')), 10000);

  await destField.click();
  await destField.sendKeys('man'); //Sets a random airport on the hopes user is not based in manchester
  let dropdownItem = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[2]/ul/li'), 10000));
  dropdownItem.click();

  let routeSelector = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/button')), 10000);
  routeSelector.click();

  //Could break, position of 'one way' changes in the ul
  let oneWayBtn = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/ul/li[2]')), 10000);
  oneWayBtn.click();

  let dateButton = await driver.wait(until.elementLocated(By.className('css-5xbxpx-runway-popup-field__button')), 10000);
  dateButton.click();

  screenshot(driver);
  //TODO find a way to wait till the element is clickable
  try{
    let calendarDays = await driver.wait(until.elementsLocated(By.className('css-1hfdvhm-runway-calendar__day')), 10000);
    screenshot(driver);
    let specificDay = await driver.wait(until.elementIsEnabled(calendarDays[0]), 10000);
    specificDay.click();
  }
  catch(e){
    console.log('error sad');
    screenshot(driver);
  }
  
  //calendarDays[2].click(); //I just picked an arbitrary day

  let exitDateBtn = await driver.wait(until.elementLocated(By.xpath("//*[@aria-label='close date selector']")), 10000);
  exitDateBtn.click();
}

const scrapeSite = async () => {
    const options = new Chrome.Options();
    const user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
    options.addArguments('--window-size=1920,1080');
    //options.addArguments(`--headless=new`);
    options.addArguments(`--user-agent=${user_agent}`);
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.excludeSwitches('enable-automation');

    let driver = await new Builder().forBrowser(Browser.CHROME)
    .setChromeOptions(options) //Added user agent manually since qantas detects headless browsers
    .build();
    
    try {
        await driver.navigate().to('https://www.qantas.com/');

        await sleep(180000).then(() => { console.log('Done!!'); });

        // Wait for the document ready state to be 'complete'
        await driver.wait(async function () {
          const readyState = await driver.executeScript('return document.readyState');
          return readyState === 'complete';
        }, 10000);  // Timeout after 10 seconds
        
        console.log('Sleeping');
        await sleep(8000).then(() => { console.log('Done!!'); });
        
        await fillDummyDetails(driver);

        //Set destination airport
        await driver.executeScript(`document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', 'SGP');`);

        //Set arrival airport
        await driver.executeScript(`document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', 'MNL');`);

        //Set date
        await driver.executeScript(`document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', '202408140000');`);

        //submit form
        let submitBtn = await driver.findElement(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[2]/div/div/button'));
        await driver.executeScript("arguments[0].click()", submitBtn);

        await driver.manage().getCookies().then(function(cookies) {
          console.log('cookie details => ', cookies);
        });

        console.log(await driver.getCurrentUrl());

        console.log('Sleeping');
        await sleep(180000).then(() => { console.log('Done!!'); });
      } 
    finally {
        await driver.quit();
    }
}

document.addEventListener('click', scrapeSite);