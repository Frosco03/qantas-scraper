const { Builder, Browser, By, Key, until } = require('selenium-webdriver');

const clickBody = async () => {
    console.log('creating new driver..');
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    
    try {
        console.log('getting website..');
        await driver.get('https://www.google.com/');
        console.log('got website!..');
      } 
    finally {
        await driver.quit();
    }
    console.log('hello world');
}

document.addEventListener('click', clickBody);