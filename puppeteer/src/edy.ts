import * as fs from "fs";
import * as puppeteer from "puppeteer";

const RAKUTEN_ID = process.env.RAKUTEN_ID;
const RAKUTEN_PASS = process.env.RAKUTEN_PASS;

interface EdyRecord {
    day: string;
    name: string;
    category: string;
    price: string;
}

export async function run(page: puppeteer.Page) {
    await page.goto("https://edy.rakuten.co.jp/my/login/mypage/?l-id=lid_header_navi_mypage");
    console.error("login page rendered.");
    await page.type("#loginForm input[name='u']", RAKUTEN_ID);
    await page.type("#loginForm input[name='p']", RAKUTEN_PASS);
    await page.click("#loginForm .loginButton");

    for (let m = 0; m < 4; m++) {
        console.error(`crowl ${m + 1} of 4 month records`);
        await page.waitForSelector("#nav-global_ehis");
        await page.click("#nav-global_ehis");

        await page.waitForSelector("#result_box", { visible: true });
        const toDetail = (await page.$$(".history_table .totalButton"))[m];
        const month = await (await toDetail.getProperty("id")).jsonValue();
        await toDetail.click();

        await page.waitForSelector("#result_box_monthly_detail", { visible: true });
        await fs.writeFileSync(
            `out/edy_${month}.json`,
            JSON.stringify(await crowlMonthlyRecords(page)),
        );
    }
}

async function crowlMonthlyRecords(page: puppeteer.Page): Promise<EdyRecord[]> {
    let records: EdyRecord[] = [];
    const pages = (await page.$$("#resultNavi li.list")).length;
    for (let i = 0; i < pages; i++) {
        await page.evaluate((num) => {
            (window as any).monthlyDetails.searchByPagingLink(num + 1);
        }, i);
        await page.waitFor(500);

        records = records.concat(
            await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".shop_table tr")).slice(1).map((tr) => {
                    return {
                        day: tr.querySelector(".day").textContent,
                        name: tr.querySelector(".name").textContent,
                        category: tr.querySelector(".category").textContent,
                        price: tr.querySelector(".money").textContent,
                    } as EdyRecord;
                });
            }),
        );
    }
    return records;
}
