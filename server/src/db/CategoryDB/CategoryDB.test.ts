import { Pool } from "mysql2/promise";
import { CategoryDB } from "./CategoryDB";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

const mockPool = {};

jest.mock("../generalQueryGenerator/GeneralQueryGenerator");

describe("Test Suite for Category DB", () => {
  const sut = new CategoryDB(mockPool as Pool);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return a GeneralQueryGenerator from the getter", () => {
    const actual = sut.getCategoryQueries();
    expect(actual).toBeInstanceOf(GeneralQueryGenerator);
  });
});
