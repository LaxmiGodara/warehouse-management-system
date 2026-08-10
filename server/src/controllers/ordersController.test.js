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
});
