interface auditOptions {
  regex?: Array<RegExp | string>;
  redirect?: boolean;
  w3c?: boolean;
  amp?: boolean;
}

interface urlObject extends auditObject {
  url: string;
}

interface requestConfigOptions {
  offsetRegex?: number;
  maxTime?: number;
  maxRedirects?: number;
  resolveWithFullResponse?: boolean;
  followAllRedirects?: boolean;
  ignoreHttpCodes?: number[];
  sitemapUrl?: string;
  userAgent?: string;
}

interface auditConfiguration {
  audits?: auditOptions;
  sitemapURL?: string;
  regexStrings?: Array<string | RegExp>;
  domain?: string;
  requestConfig?: requestConfigOptions;
}

type setAuditFunction = () => auditObject;

interface report {
  http: {
    url: string;
    status: number;
  };
  date: Date;
  redirect?: {
    statusCode: number;
    redirectUri: string;
  }[];
  regex: string[];
  amp?: {
    status: string;
    errors: any[];
  };
}

interface auditObject {
  audits: auditOptions;
  configuration: requestConfigOptions;
  report: report[];
  urls: Array<string | urlObject>;
  setAudits: (params: auditOptions) => auditObject;
  addUrls: (urls: string | Array<string | urlObject>) => auditObject;
  setUrls: (urls: string | Array<string | urlObject>) => auditObject;
  setUserAgent: (userAgent?) => auditObject;
  setConfiguration: (configuration: requestConfigOptions) => auditObject;
  setUrlsFromSitemap: (url: string) => Promise<auditObject>;
  make: () => Promise<report[]>;
}

declare const auditFunction: (options?: auditConfiguration) => auditObject;

export = auditFunction;
