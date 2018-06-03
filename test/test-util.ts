import "mocha";
import { expect } from "chai";

import { getRootDomain } from "../src/common/util";

describe("util", () => {
  describe("getRootDomain", () => {
    const TEST_CASES = [
      [ "1.2.3.4", "1.2.3.4" ],
      [ "::1", "::1" ],
      [ "a:b:000c::0000", "a:b:000c::0000" ],
      [ "example.com", "example.com" ],
      [ "subdomain.example.com", "example.com" ],
      [ "subdomain.example.co.uk", "example.co.uk" ]
    ];

    TEST_CASES.forEach(([ input, expected ]) => {
      it(`should return ${expected} when given ${input}`, () => {
        expect(getRootDomain(input)).to.equal(expected);
      });
    })
  });
});
