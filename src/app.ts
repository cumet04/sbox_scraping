import * as puppeteer from "puppeteer";

const PITAPA_ID = process.env.PITAPA_ID;
const PITAPA_PASS = process.env.PITAPA_PASS;

const waitForDownload = (page: puppeteer.Page) => page.waitFor(500); // temporary hack

async function run(page: puppeteer.Page) {
    await (page as any)._client.send(
        "Page.setDownloadBehavior",
        { behavior: "allow", downloadPath: "." },
    );

    await page.goto("https://www2.pitapa.com/login.html");
    await page.type("[name='id']", PITAPA_ID);
    await page.type("[name='password']", PITAPA_PASS);
    await page.click("[name='login']");
    await page.waitForSelector("body");

    for (let i = 0; i < 4; i++) {
        await page.goto("https://www2.pitapa.com/member/K120100.do");
        await page.evaluate((index) => {
            const MEISAI_INDEX = 1;
            document.
                querySelectorAll("select[name='claimYM']")[MEISAI_INDEX].
                querySelectorAll("option")[index].selected = true;
            (document.querySelectorAll("input[value='表示する']")[MEISAI_INDEX] as HTMLInputElement).click();
        }, i);
        await page.waitForSelector("body");
        await page.click("input[name='csvSubmit']");
        await waitForDownload(page);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await run(page);
    } catch (err) {
        await page.screenshot({ path: "error.png", fullPage: true });
        process.on("exit", () => {
            process.exit(1);
        });
    }
    await browser.close();
})();
