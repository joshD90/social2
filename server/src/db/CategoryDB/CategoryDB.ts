import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";

export class CategoryDB {
  private connection: Pool;
  private categoryQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.categoryQueries = new GeneralQueryGenerator("categories", connection);
  }

  getCategoryQueries(): GeneralQueryGenerator {
    return this.categoryQueries;
  }
}
