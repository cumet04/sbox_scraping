import * as puppeteer from "puppeteer";
import * as edy from "./edy";
import * as pitapa from "./pitapa";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.error("page launched.");
    try {
        switch (process.argv[2]) {
            case "edy":
                await edy.run(page);
                break;
            case "pitapa":
                await pitapa.run(page);
                break;
        }
    } catch (err) {
        console.error(err);
        await page.screenshot({ path: "out/error.png", fullPage: true });
        process.on("exit", () => {
            process.exit(1);
        });
    }
    await browser.close();
})();
