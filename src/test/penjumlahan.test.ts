import { penjumlahan } from "../controllers/penjumlahan";
import { cloneArray } from "../controllers/penjumlahan";

describe("testing", () => {
  test("sum of a and b", () => {
    expect(penjumlahan(1, 2)).toBe(3);
  });
});

test("array", () => {
  const arr = [1, 2, 3];
  expect(cloneArray(arr)).toEqual(arr);
});
