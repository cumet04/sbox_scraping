import os
import time
import json
import logging
logger = logging.getLogger(__name__)
logger.setLevel(level=logging.INFO)
logger.addHandler(logging.StreamHandler())

from selenium import webdriver

RAKUTEN_ID = os.environ['RAKUTEN_ID']
RAKUTEN_PASS = os.environ['RAKUTEN_PASS']


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

driver.get("https://edy.rakuten.co.jp/my/login/mypage/?l-id=lid_header_navi_mypage")
form = driver.find_element_by_id("loginForm")
form.find_element_by_name("u").send_keys(RAKUTEN_ID)
form.find_element_by_name("p").send_keys(RAKUTEN_PASS)
form.find_element_by_class_name("loginButton").click()
logger.info("submitted login info.")

driver.find_element_by_id("nav-global_ehis").click()
logger.info("display monthly totals")
time.sleep(1)  # wait redirection

driver.find_elements_by_css_selector(".history_table .totalButton")[0].click()
raw = driver.find_element_by_id("his_record").get_attribute("value")
# json.loads decodes unicode-escape, but '\u3000' is left as is
record = json.loads(raw.replace('\u3000', '　'))
print(record)
logger.info("get latest month history")

driver.quit()
