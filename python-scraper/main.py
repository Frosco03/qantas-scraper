
import undetected_chromedriver as uc
import time

global driver

def fillDummyFields():
    #TODO Complete migration from scrape.js and get the data
    driver.find_element('xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/div/button').click()

    #We only fill destField because origin is already set
    destField = WebDriverWait(driver, 20)
    driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[1]/input')), 10000);

    await destField.click();
    await destField.sendKeys('man'); //Sets a random airport on the hopes user is not based in manchester
    let dropdownItem = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[2]/ul/li'), 10000));
    dropdownItem.click();

    let routeSelector = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/button')), 10000);
    routeSelector.click();

driver = uc.Chrome()

driver.get('https://www.qantas.com/')

#When 'card itinerary' shows up, there are given flights (this is sa results)

time.sleep(5)

fillDummyFields()

time.sleep(3)

driver.quit()