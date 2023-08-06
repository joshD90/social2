import capitaliseFirstLetter from "./capitaliseFirstLetter";

describe("capitalise first letter function test suite", () => {
  it("should capitalise the first letter and no others", () => {
    const sut = capitaliseFirstLetter("hello");
    expect(sut).toBe("Hello");
  });

  it("it should keep any non alphabetic numbers", () => {
    const sut = capitaliseFirstLetter("h3llo!");
    expect(sut).toBe("H3llo!");
  });

  it("should return an empty string when given an empty string", () => {
    const sut = capitaliseFirstLetter("");
    expect(sut).toBe("");
  });
});
