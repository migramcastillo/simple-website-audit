# Simple Website Audit

This is a small suite to improve and check your website status, it can help you to look for specific errors that your template engine can throw, all the redirect path from a URL to check where is it going, mobile browser request header to check in the case you have a specific mobile version, AMO validation and  Lighthouse testing integration (for now it needs to open a browser on your computer, so please avoid use this feature on no GUI devices).

## Features

- HTTP status code check
- Avoid and deny list for filtering results
- Search regex in your HTML results
- Full redirect path, specifing code and URL where is redirecting
- AMP Audit
- W3C Audit
- Verify all URLs from the sitemap URL or from an array of values (check API for more information)
- Verify as mobile browser
- Lighthouse scores (beta)
- Report generating a JSON file

## Requisites

NodeJS > 10 LTS
Browser availability if you're using Lighthouse feature

### Installing

```
npm install simple-website-audit
```

## API

Coming soon

## Node TAP testing example integration

Coming soon
