# Qantas Rewards Flights Scraper
## Overview
The Qantas Reward Flights Scraper is a tool designed to automate the process of retrieving information on reward flights from Qantas' website. This web scraper aims to simplify the process of checking available reward flights, saving users time and effort. One of the key points of this project is that it is free to use, unlike other similar APIs that require a paid subscription to access reward flight information.

## How it's made
**Tech used:** Electron, Python, Javascript (Node), Selenium Webdriver
The front-end of the program is made in Electron, while javascript code runs in the background that connects to the back-end scraping script by Python. The Python script is running on a modified version of Selenium webdriver called **'undetected_webdriver'** to bypass the bot detection mechanisms of the Qantas website.

### Program Process
1. User inputs needed information on the app
2. When scrape button is pressed, python script starts running
3. Browser window opens to scrape needed dates
4. Python saves the scraped information on a JSON file
5. Javascript takes the info from the JSON file and outputs it in the app

## Task List
This section shows the current progress of the project
- [x] Scrape Qantas website
- [x] Allow scraping for one date
- [ ] Allow scraping for multiple dates
- [ ] Save data to a CSV file

## Directory
**python-scraper** - contains source code of the python script

**qantas-scraper** - contains source code of the electron/js app (specifically in the /src folder)
