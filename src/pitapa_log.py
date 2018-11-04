import os
import time
import json
import logging
logger = logging.getLogger(__name__)
logger.setLevel(level=logging.INFO)
logger.addHandler(logging.StreamHandler())

from selenium import webdriver

PITAPA_ID = os.environ['PITAPA_ID']
PITAPA_PASS = os.environ['PITAPA_PASS']

def init_selenium_driver():
    global driver
    options = webdriver.chrome.options.Options()
    options.binary_location = os.environ['CHROME_BIN']
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    # TODO: error handling for 'Connection reset by peer'
    driver = webdriver.Chrome(os.environ['CHROME_DRIVER'], chrome_options=options)
    logger.info("initialized selenium driver.")


init_selenium_driver()

driver.get("https://www2.pitapa.com/login.html")
driver.find_element_by_name("id").send_keys(PITAPA_ID)
driver.find_element_by_name("password").send_keys(PITAPA_PASS)
driver.find_element_by_name("login").click()
logger.info("submitted login info.")

driver.get("https://www2.pitapa.com/member/K120100.do")
month_selector = driver.find_elements_by_name("claimYM")[1] # put select tag for Details
print(month_selector.get_attribute('value'))

driver.quit()
