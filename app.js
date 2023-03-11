const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

const baseUrl = "https://dev.antares.chat";
const maxPages = 60;
let pagesCrawled = 0;
let pagesToCrawl = [baseUrl];
const content = {};

async function crawlPage(pageUrl) {
  try {
    const response = await axios.get(pageUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const pageTitle = $("title").text();
    const pageDescription = $('meta[name="description"]').attr("content") || "";
    const pageHeaders = [];
    $("h1,h2,h3,h4,h5,h6").each(function () {
      pageHeaders.push($(this).text());
    });
    const pageParagraph = [];
    $("p").each(function () {
      pageParagraph.push($(this).text());
    });
    const pageImages = [];
    $("img").each(function () {
      const imageUrl = $(this).attr("src");
      if (imageUrl) {
        const absoluteUrl = url.resolve(baseUrl, imageUrl);
        pageImages.push(absoluteUrl);
      }
    });

    content["crawled_links"] = null;
    content[pageUrl] = {
      title: pageTitle,
      description: pageDescription,
      headers: pageHeaders,
      paragraph: pageParagraph,
      images: pageImages,
    };

    $("a").each(function () {
      const link = $(this).attr("href");
      if (link) {
        const absoluteUrl = url.resolve(baseUrl, link);
        const parsedUrl = url.parse(absoluteUrl);
        if (parsedUrl.hostname === url.parse(baseUrl).hostname) {
          pagesToCrawl.push(absoluteUrl);
        }
      }
    });

    pagesCrawled++;
    const uniquePageToCrawl = [...new Set(pagesToCrawl)];
    const percentage = Math.round(
      (pagesCrawled / uniquePageToCrawl.length) * 100
    );
    console.log(
      `${pageUrl} - Crawled ${pagesCrawled} of ${uniquePageToCrawl.length} pages (${percentage}%)`
    );
    if (
      pagesCrawled === uniquePageToCrawl.length ||
      pagesCrawled === maxPages
    ) {
      content["crawled_links"] = uniquePageToCrawl;
      const maxPagesPerFile = 30;
      const numFiles = Math.ceil(maxPages / maxPagesPerFile);
      for (let i = 0; i < numFiles; i++) {
        const startIndex = i * maxPagesPerFile;
        const endIndex = Math.min(startIndex + maxPagesPerFile, pagesCrawled);
        const fileContent = {
          crawled_links: uniquePageToCrawl.slice(startIndex, endIndex),
        };
        for (let j = startIndex; j < endIndex; j++) {
          const pageUrl = uniquePageToCrawl[j];
          fileContent[pageUrl] = content[pageUrl];
        }
        const hostname = url.parse(baseUrl).host;
        const domainName = hostname.replace(/\.[^/.]+$/, "");
        const fileName = `output_${moment().format("YYYY-MM-DDTHH-mm-ss")}_${
          i + 1
        }.json`;
        const filepath = path.join(__dirname, `${domainName}`, fileName);
        const output = JSON.stringify(fileContent);

        if (!fs.existsSync(path.dirname(filepath))) {
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        fs.writeFileSync(filepath, output);
        console.log(`File saved: ${fileName}`);
      }
      console.log("Crawling finished.");
      return;
    } else {
      await crawlPage(uniquePageToCrawl[pagesCrawled]);
    }
  } catch (error) {
    console.error(error);
  }
}

console.log("Crawling started...");
crawlPage(baseUrl);
