import * as puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "userdir",
    });
    const page = await browser.newPage();
    await page.goto("https://moneyforward.com/auth/google");
    await page.waitForSelector("body#page-home");
    await page.goto("https://moneyforward.com/cf");
    await page.waitForSelector("#cf-detail-table");
    await page.evaluate(() => {
        document.querySelectorAll("#cf-detail-table .js-cf-edit-container");

    });

    // await browser.close();
})();
