import { 
  generateString, 
  validateInput,
} from "./unitTests";

describe("testing src/helpers/unitTest.ts", () => {
  test("generates a random string of n length", async () => {
    const string = await generateString(10);
    expect(string).toHaveLength(10);
  });

  test("validation", async () => {
    const props = { value: "" };
    const success = await validateInput("required", props, "ATATTextField", 0);
    expect(success).toBeFalsy();
  })

});