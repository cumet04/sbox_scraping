import * as puppeteer from "puppeteer";
import * as pitapa from "./pitapa";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await pitapa.run(page);
    } catch (err) {
        await page.screenshot({ path: "out/error.png", fullPage: true });
        process.on("exit", () => {
            process.exit(1);
        });
    }
    await browser.close();
})();
