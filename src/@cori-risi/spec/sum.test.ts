import { describe, expect, it } from "vitest";
import { sum } from "../utils";

describe("sum function ", () => {
    it("should return 0 if arguments are null or non-number", () => {
        expect(sum()).toBe(0);
    });

    it('should return sum of argument values if arguments are numbers', () => {
        expect(sum(1)).toBe(1);
        expect(sum(1, 2)).toBe(3);
    });
});
