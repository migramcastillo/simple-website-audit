interface auditOptions {
  regex?: boolean;
  redirect?: boolean;
  w3c?: boolean;
  amp?: boolean;
  seo?: boolean;
  lighthouse?: boolean;
}

interface requestConfigOptions {
  offsetRegex?: number;
  maxTime?: number;
  maxRedirects?: number;
  resolveWithFullResponse?: boolean;
  followAllRedirects?: boolean;
  ignoreHttpCodes?: number[];
  listenHttpCodes?: number[];
  usingSitemap?: string;
  fromMobile?: boolean;
}

interface auditConfiguration {
  audits?: auditOptions;
  sitemapURL?: string;
  regexStrings?: Array<string | RegExp>;
  domain?: string;
  requestConfig?: requestConfigOptions;
}

type setAuditFunction = () => auditObject;

interface auditObject {
  configuration: auditConfiguration;
  setAudits: (params: auditOptions) => auditObject;
  setDomain: (domain: string) => auditObject;
  setConfiguration: (configuration: auditConfiguration) => auditObject;
  setRegexString: (values: Array<string | RegExp>) => auditObject;
  setURLsFromSitemap: (url: string) => Promise<auditObject>;
}

declare const auditFunction: (options?: auditConfiguration) => auditObject;

export = auditFunction;
