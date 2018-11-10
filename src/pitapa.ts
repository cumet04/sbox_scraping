import * as puppeteer from "puppeteer";

const PITAPA_ID = process.env.PITAPA_ID;
const PITAPA_PASS = process.env.PITAPA_PASS;

const waitForDownload = (page: puppeteer.Page) => page.waitFor(500); // temporary hack

export async function run(page: puppeteer.Page) {
    await (page as any)._client.send(
        "Page.setDownloadBehavior",
        { behavior: "allow", downloadPath: "out" },
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
