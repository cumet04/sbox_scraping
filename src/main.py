import os
from selenium import webdriver


def init_selenium_driver():
    global driver
    options = webdriver.chrome.options.Options()
    options.binary_location = os.environ['CHROME_BIN']
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(
        os.environ['CHROME_DRIVER'],
        chrome_options=options)


init_selenium_driver()

driver.get("https://www.google.com/")
driver.save_screenshot("./tmp/ss.png")
driver.quit()
