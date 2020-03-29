import { test } from "tap";
import sanitizeUrl from "../helpers/sanitize-url";

test("Sanitize URL Tests", subtest => {
  subtest.test(
    "Should sanitize with https if the URL doesn't start with protocol",
    t => {
      const url = "www.google.com";
      const sanitized = sanitizeUrl(url);
      const expected = "https://www.google.com";
      t.equal(sanitized, expected);
      t.end();
    }
  );

  subtest.test(
    "Should return the same url if it starts with http or https",
    t => {
      const urlSecure = "https://www.google.com";
      const url = "http://nosecure.com";
      const sanitizedSecure = sanitizeUrl(urlSecure);
      const sanitizedPlain = sanitizeUrl(url);
      const expectedSecure = "https://www.google.com";
      const expectedPlain = "http://nosecure.com";
      t.equal(sanitizedSecure, expectedSecure, "https urls should not change");
      t.equal(sanitizedPlain, expectedPlain, "http urls should not change");
      t.end();
    }
  );

  subtest.end();
});
