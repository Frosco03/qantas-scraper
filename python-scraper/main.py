
import json
import undetected_chromedriver as uc
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

import time

global driver
global data

def findElementIfAvail(driver, by, value, timeout=10):
    wait = WebDriverWait(driver, timeout=timeout)
    wait.until(lambda d : d.find_element(by, value).is_displayed())
    return driver.find_element(by, value)

def findElementIfEnabled(driver, by, value):
    wait = WebDriverWait(driver, timeout=10)
    wait.until(lambda d : d.find_elements(by, value).is_enabled())
    return driver.find_elements(by, value)

def fillDummyFields():
    wait = WebDriverWait(driver, timeout=10)
    destBtn = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/div/button')
    destBtn.click()

    #We only fill destField because origin is already set
    destField = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[1]/input')
    destField.click()

    destField.send_keys('man') #Sets a random airport on the hopes user is not based in manchester
    destField.click()

    dropdownList = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[7]/div/div/div/div/div[1]/div/div/div[2]/ul')
    dropdownListItem = dropdownList.find_element('tag name', 'li')
    driver.execute_script("arguments[0].scrollIntoView(true);", dropdownListItem)
    dropdownListItem.click()

    routeSelector = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/button')
    routeSelector.click()

    #Could break, position of 'one way' changes in the ul
    oneWayBtn = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[1]/div[2]/div/div/ul/li[2]')
    oneWayBtn.click()

    dateButton = findElementIfAvail(driver, 'class name', 'css-5xbxpx-runway-popup-field__button')
    dateButton.click()

    calendarDays = driver.find_elements('class name', 'css-1hfdvhm-runway-calendar__day')
    time.sleep(2)

    for specificDay in calendarDays:
        wait.until(lambda d: specificDay.is_displayed())
        if specificDay.is_enabled():
            specificDay.click()
            break

    exitDateBtn = findElementIfAvail(driver, 'xpath', "//*[@aria-label='close date selector']")
    exitDateBtn.click();

    rewardsBtn = findElementIfAvail(driver, 'css selector', 'div[data-testid="use-points"]')
    rewardsBtn.click()

def getFlightDetails(parent):
    #departure-arrival-time => classname
    #e2e-flight-number => classname
    #.details-label.duration => css selector

    flights = []

    segmentContainer = parent.find_elements('class name', 'segment')
    for segment in segmentContainer:
        flightInfo = {}
        departure_arrival = parent.find_element('class name', 'departure-arrival-time')
        times = departure_arrival.find_elements('css selector', '.lead-value.text-big')

        flightInfo['departureTime'] = times[0].text
        flightInfo['arrivalTime'] = times[1].text

        flightInfo['flightNo'] = segment.find_element('class name', 'e2e-flight-number').text

        locations = segment.find_element('class name', 'row')
        flightInfo['origin'] = locations.find_element('xpath', '//*[@id="e2e-itinerary-0"]/div/div[1]/div/upsell-flight-summary/div/upsell-segment-details[1]/div/div[1]/div[1]/span[1]').text
        flightInfo['destination'] = locations.find_element('xpath', '//*[@id="e2e-itinerary-0"]/div/div[1]/div/upsell-flight-summary/div/upsell-segment-details[1]/div/div[1]/div[2]/span[1]').text

        flights.append(flightInfo)

    return flights

def getRewardValues(parent):
    flightCardPaths = [
        ('economyReward', '//*[starts-with(@class, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[1]/div/label/div/span[2]/div/span/span/span'),
        ('economyPrice', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[1]/div/label/div/span[2]/div/span/span/div/div'),
        ('premEconomyReward', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[2]/div/label/div/span[2]/div/span/span/span'),
        ('premEconomyPrice', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[2]/div/label/div/span[2]/div/span/span/div/div'),
        ('businessReward', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[3]/div/label/div/span[2]/div/span/span/span'),
        ('businessPrice', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[3]/div/label/div/span[2]/div/span/span/div/div'),
        ('firstReward', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[4]/div/label/div/span[2]/div/span/span/span'),
        ('firstPrice', '//*[starts-with(@id, "fareFamiliesContainer")]/upsell-itinerary-fares/upsell-fare-cell[4]/div/label/div/span[2]/div/span/span/div/div'),
    ]

    flightInfo = {}

    flightInfo['flights'] = getFlightDetails(parent)

    for name, path in flightCardPaths:
        try:
            flightInfo[name] = parent.find_element('xpath', path).text
        except:
            flightInfo[name] = 0

    return flightInfo
    

def scrapeSite():
    wait = WebDriverWait(driver, timeout=15)
    try:
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.card.itinerary')))
        resultList = driver.find_elements('css selector', '.card.itinerary')
    except:
        resultList = False

    if resultList:
        for result in resultList:
            
            data.append(getRewardValues(result))

    print(json.dumps(data))
            
    #TODO: Only go next date kung may natira pang days
    #goNextDate()

def goNextDate():
    wait = WebDriverWait(driver, timeout=15)
    calendar = findElementIfAvail(driver, 'css selector', '.cal-offset-lg-1.cal-offset-md-2.cal-offset-xs-3.calendar-rewards')
    wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, 'button')))
    calendarBtns = calendar.find_elements('tag name', 'button')

    index = 0
    for button in calendarBtns:
        if not button.is_enabled():
            #This is our current date
            index = calendarBtns.index(button)
    
    wait.until(EC.element_to_be_clickable(calendarBtns[index+1]))
    calendarBtns[index+1].click()

    scrapeSite()


# chrome_options = Options()
# chrome_options.add_argument("--headless=new")
# chrome_options.add_argument('--window-size=1920,1080')
data = []

driver = uc.Chrome()
driver.get('https://www.qantas.com/')

fillDummyFields()

# Set destination airport
driver.execute_script("document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', 'CEB');")
# Set arrival airport
driver.execute_script("document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', 'SIN');")
# Set date
driver.execute_script("document.evaluate('/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/input[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('value', '202407230000');")

submitBtn = findElementIfAvail(driver, 'xpath', '/html/body/div[1]/div/div/div[3]/main/div/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div/div/div[1]/form/div[2]/div/div/button')
submitBtn.click()

#Just in case button with "continue" shows up (in some cases where you book internationally)
try:
    continueBtn = findElementIfAvail(driver, 'xpath', '//*[@id="btn-qf-continue"]', 5)
except:
    continueBtn = False

if(continueBtn):
    continueBtn.click()

scrapeSite()

driver.close()
driver.quit()