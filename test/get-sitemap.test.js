import { test } from "tap";
import getSitemap from "../helpers/get-sitemap";

test("Get Sitemap Tests", subtest => {
  subtest.test("Should get sitemap info from URL", async t => {
    const sitemapUrl = "https://zeit.co/sitemap.xml";
    const jsonInfo = await getSitemap(sitemapUrl);

    t.ok(jsonInfo, "Should get sitemap info");
    t.type(jsonInfo, "Array", "Response should be an array");
    Array.from(jsonInfo).forEach(value => {
      t.type(value, "string", "All values from response should be string");
    });
    t.end();
  });

  subtest.test("Should throw error for non existing URL", async t => {
    const sitemapUrl = "https://zeit.co/sitemap.xxml";
    await t.rejects(getSitemap(sitemapUrl), "Should reject with wrong sitemap");
    t.end();
  });

  subtest.end();
});
