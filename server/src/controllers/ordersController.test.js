import { calculateAmounts } from "./ordersController.js";

describe("calculateAmounts", () => {
  test("calculates line amount correctly", () => {
    const items = [
      {
        quantity: 3,
        rate: 500,
      },
    ];
    const result = calculateAmounts(items);
    expect(result[0].lineAmount).toBe(1500);
  });

  test("calculates line amount for another valid quantity", () => {
    const items = [
      {
        quantity: 2,
        rate: 1000,
      },
    ];

    const result = calculateAmounts(items);
    expect(result[0].lineAmount).toBe(2000);
  });

  // Test 3: Multiple items
  test("calculates line amount for multiple items", () => {
    const items = [
      {
        quantity: 2,
        rate: 500,
      },
      {
        quantity: 3,
        rate: 1000,
      },
    ];

    const result = calculateAmounts(items);

    expect(result[0].lineAmount).toBe(1000);
    expect(result[1].lineAmount).toBe(3000);
  });

  // Test 4: Empty array
  test("returns an empty array when no items are provided", () => {
    const items = [];

    const result = calculateAmounts(items);

    expect(result).toEqual([]);
  });

  // Test 5: Boundary / edge case
  test("calculates line amount correctly when quantity is 1", () => {
    const items = [
      {
        quantity: 1,
        rate: 500,
      },
    ];

    const result = calculateAmounts(items);

    expect(result[0].lineAmount).toBe(500);
  });
});
