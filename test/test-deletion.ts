import "./browserTypingShim";

import "mocha";
import { expect } from "chai";

import { shouldPreserve } from "../src/common/deletion";
import { HostnameRule } from "../src/common/state";

describe("deletion", () => {
  describe("shouldPreserve", () => {
    interface ShouldPreserveTestCase {
      descriptor: string;
      domainWithoutTld: string;
      rulesWithoutTlds: HostnameRule[];
      openRootDomainsWithoutTlds: string[];
      expected: boolean;
    }

    const TEST_CASES: ShouldPreserveTestCase[] = [
      {
        descriptor: "there is an exact match in the open root domains",
        domainWithoutTld: "example",
        rulesWithoutTlds: [],
        openRootDomainsWithoutTlds: [ "example" ],
        expected: true,
      }, {
        descriptor: "there is a parent domain match in the open root domains",
        domainWithoutTld: "subdomain.example",
        rulesWithoutTlds: [],
        openRootDomainsWithoutTlds: [ "example" ],
        expected: true,
      }, {
        descriptor: "there is an exact match in a rule",
        domainWithoutTld: "example",
        rulesWithoutTlds: [
          {
            hostname: "example",
            includeSubdomains: false,
          }
        ],
        openRootDomainsWithoutTlds: [],
        expected: true,
      }, {
        descriptor: "there is a parent domain match in a rule that allows subdomains",
        domainWithoutTld: "subdomain.example",
        rulesWithoutTlds: [
          {
            hostname: "example",
            includeSubdomains: true,
          }
        ],
        openRootDomainsWithoutTlds: [],
        expected: true,
      }, {
        descriptor: "no rules or open root domains are provided",
        domainWithoutTld: "example",
        rulesWithoutTlds: [],
        openRootDomainsWithoutTlds: [],
        expected: false,
      }, {
        descriptor: "there is a parent domain match in a rule that disallows subdomains",
        domainWithoutTld: "subdomain.example",
        rulesWithoutTlds: [
          {
            hostname: "example",
            includeSubdomains: false,
          }
        ],
        openRootDomainsWithoutTlds: [],
        expected: false,
      }
    ];

    function comify(domainWithoutTld: string) {
      return domainWithoutTld + ".com";
    }

    function coukify(domainWithoutTld: string) {
      return domainWithoutTld + ".co.uk";
    }

    TEST_CASES.forEach(({ descriptor, domainWithoutTld, rulesWithoutTlds, openRootDomainsWithoutTlds, expected }) => {
      context(`should return ${expected} when ${descriptor}`, () => {
        const comDomain = comify(domainWithoutTld);
        const comRules = rulesWithoutTlds.map(r => ({ ...r, hostname: comify(r.hostname)}));
        const comOpenRootDomains = new Set(openRootDomainsWithoutTlds.map(comify));

        it(comDomain, () => {
          expect(shouldPreserve(comDomain, comRules, comOpenRootDomains)).to.equal(expected);
        });

        it("." + comDomain, () => {
          expect(shouldPreserve("." + comDomain, comRules, comOpenRootDomains)).to.equal(expected);
        });

        const coukDomain = coukify(domainWithoutTld);
        const coukRules = rulesWithoutTlds.map(r => ({ ...r, hostname: coukify(r.hostname)}));
        const coukOpenRootDomains = new Set(openRootDomainsWithoutTlds.map(coukify));

        it(coukDomain, () => {
          expect(shouldPreserve(coukDomain, coukRules, coukOpenRootDomains)).to.equal(expected);
        });

        it("." + coukDomain, () => {
          expect(shouldPreserve("." + coukDomain, coukRules, coukOpenRootDomains)).to.equal(expected);
        });
      });
    });
  });
});
