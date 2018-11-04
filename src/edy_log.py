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

month_page = 0

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

driver.find_elements_by_css_selector(".history_table .totalButton")[month_page].click()

page_len = len(driver.find_elements_by_css_selector("#resultNavi li.list a"))
records = []
for num in range(page_len):
    driver.execute_script(f'monthlyDetails.searchByPagingLink({num+1})')
    time.sleep(0.5)
    trs = driver.find_elements_by_css_selector(".shop_table tr")[1:] # without header
    for tr in trs:
        records.append({
            'day':      tr.find_element_by_class_name("day").text,
            'name':     tr.find_element_by_class_name("name").text,
            'category': tr.find_element_by_class_name("category").text,
            'price':    tr.find_element_by_class_name("money").text,
        })

with open(f'out_{month_page}.json', mode='w') as f:
    f.write(json.dumps(records, ensure_ascii=False))
logger.info("get latest month history")

driver.quit()
