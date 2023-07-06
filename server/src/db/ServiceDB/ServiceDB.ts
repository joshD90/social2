import { Pool, ResultSetHeader } from "mysql2/promise";
import { initServiceTablesQueries as initQueryObj } from "./serviceInitDBQueries";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import {
  ISubServiceItem,
  SubCategoryTableSpecific,
  SubServiceKey,
  TAreasServed,
  TClientGroups,
  TNeedsMet,
} from "../../types/serviceTypes/subServiceCategories";
import { IService } from "../../types/serviceTypes/ServiceType";

export class ServiceDB {
  private connection: Pool;
  //queries for our Base information
  private ServiceBaseQueries: GeneralQueryGenerator;
  //Generic Query Class for Sub Tables
  private needsMetQueries: GeneralQueryGenerator;
  private clientGroupsQueries: GeneralQueryGenerator;
  private areasServedQueries: GeneralQueryGenerator;
  //Generic Query Class for Junction Tables
  private needsMetJunctionQueries: GeneralQueryGenerator;
  private clientGroupsJunctionQueries: GeneralQueryGenerator;
  private areasServedJunctionQueries: GeneralQueryGenerator;
  constructor(connection: Pool) {
    this.connection = connection;
    //queries for our Base information
    this.ServiceBaseQueries = new GeneralQueryGenerator("services", connection);
    //Generic Query Class for Sub Tables
    this.needsMetQueries = new GeneralQueryGenerator("needsMet", connection);
    this.clientGroupsQueries = new GeneralQueryGenerator(
      "clientGroups",
      connection
    );
    this.areasServedQueries = new GeneralQueryGenerator(
      "areasServed",
      connection
    );
    //Generic Query Class for Junction Tables
    this.needsMetJunctionQueries = new GeneralQueryGenerator(
      "service_needs",
      connection
    );
    this.clientGroupsJunctionQueries = new GeneralQueryGenerator(
      "service_clientGroups",
      connection
    );
    this.areasServedJunctionQueries = new GeneralQueryGenerator(
      "service_areas",
      connection
    );
  }
  //create all our tables if they don't exist already
  public async initialiseServiceRelatedTables(): Promise<void> {
    try {
      //main tables
      await this.connection.query(initQueryObj.createCategoriesTable);
      await this.connection.query(initQueryObj.createServicesTable);
      //sub tables
      await this.connection.query(initQueryObj.createNeedsMetTable);
      await this.connection.query(initQueryObj.createClientGroupTable);
      await this.connection.query(initQueryObj.createAreaServedTable);
      //junction tables
      await this.connection.query(
        initQueryObj.createServiceClientGroupJunction
      );
      await this.connection.query(initQueryObj.createServiceAreaJunction);
      await this.connection.query(initQueryObj.createServiceNeedsJunction);
    } catch (error) {
      console.log(error);
    }
  }

  //this compacts all the methods involved in creating the multiple tables associated with a service
  public async createFullServiceEntry(
    baseData: IService,
    subCategories: (TAreasServed | TNeedsMet | TClientGroups)[]
  ): Promise<ResultSetHeader | Error> {
    try {
      this.connection.beginTransaction();
      //make our base table before proceeding
      const baseResult =
        await this.ServiceBaseQueries.createTableEntryFromPrimitives(
          baseData as unknown as IGenericIterableObject
        );
      if (baseResult instanceof Error)
        throw new Error("Could not make the base table for service");

      const serviceId = baseResult.insertId;

      //now that we have made our base table entry we can create our sub directories
      const successArray = await Promise.all(
        subCategories.map((category) => {
          const specificSubArray = this.generateSubTableVariables(category);
          return this.addFullSubCategory(
            specificSubArray,
            Object.values(category)[0],
            serviceId
          );
        })
      );
      if (successArray.some((el) => el === "failure")) {
        // this.deleteAllEntriesRelatedToService(serviceId);
        throw new Error("could not make the sub categories");
      }
      //commit all the changes if there are no errors
      this.connection.commit();
      return baseResult;
    } catch (error) {
      console.log(error);
      this.connection.rollback();
      return error as Error;
    }
  }

  //add all subCategory Entries within a specific type
  public async addFullSubCategory(
    specificTableVar: SubCategoryTableSpecific,
    data: ISubServiceItem[],
    serviceId: number
  ): Promise<"success" | "failure"> {
    const successArray = await Promise.all(
      data.map((entry) => {
        return this.addSubCategory(
          specificTableVar.tableQueries,
          specificTableVar.junctionTableQueries,
          entry,
          specificTableVar.tableName as SubServiceKey,
          serviceId
        );
      })
    );
    if (successArray.some((el) => el === "failure")) return "failure";
    return "success";
  }

  //create one subCategory Entry
  public async addSubCategory(
    generalTableQuery: GeneralQueryGenerator,
    junctionTableQuery: GeneralQueryGenerator,
    data: ISubServiceItem,
    subTable: SubServiceKey,
    serviceId: number
  ): Promise<"success" | "failure"> {
    //we need to change the format to fit the general table query.
    const formattedData = { [subTable]: data.value };
    try {
      const result = await generalTableQuery.createTableEntryFromPrimitives(
        formattedData
      );
      if (result instanceof Error)
        throw new Error("Could not create the Sub Directory");
      //take the id from the result and use this for the junction table
      //prepare our data
      const subId = result.insertId;
      const refColName = this.generateRefColNameJunc(subTable);
      const junctionData = {
        service_id: serviceId,
        [refColName]: subId,
        exclusive: data.exclusive,
      };
      //insert into our junction table.
      const junctionResult =
        await junctionTableQuery.createTableEntryFromPrimitives(junctionData);
      if (junctionResult instanceof Error) {
        throw Error(junctionResult.message);
      }
      return "success";
    } catch (error) {
      console.log(error);
      return "failure";
    }
  }
  //create the column name for the junction reference table
  private generateRefColNameJunc(subTable: SubServiceKey): string {
    switch (subTable) {
      case "needsMet":
        return "need_id";
      case "clientGroups":
        return "clientGroup_id";
      case "areasServed":
        return "area_id";
      default:
        throw Error("not of type SubServiceKey");
    }
  }
  //create the variables based on the type of subCategory we are trying to work with
  private generateSubTableVariables(
    subCategory: TAreasServed | TNeedsMet | TClientGroups
  ): SubCategoryTableSpecific {
    let tableQueries: GeneralQueryGenerator;
    let junctionTableQueries: GeneralQueryGenerator;
    let tableName: string;
    if (Object.keys(subCategory)[0] === "areasServed") {
      tableQueries = this.areasServedQueries;
      junctionTableQueries = this.areasServedJunctionQueries;
      tableName = SubServiceKey.NeedsMet;
    } else if (Object.keys(subCategory)[0] === "clientGroups") {
      tableQueries = this.clientGroupsQueries;
      junctionTableQueries = this.clientGroupsJunctionQueries;
      tableName = SubServiceKey.ClientGroups;
    } else {
      tableQueries = this.needsMetQueries;
      junctionTableQueries = this.needsMetJunctionQueries;
      tableName = SubServiceKey.NeedsMet;
    }
    return { tableQueries, junctionTableQueries, tableName };
  }

  //delete all documents related to a single serviceId
  public async deleteServiceAndRelatedEntries(serviceId: number) {
    //we need to seperate all this out to delete in a specific order as they reference each other - junction/ base / subcategories
    const junctionTablesQuery = [
      this.areasServedJunctionQueries,
      this.clientGroupsJunctionQueries,
      this.needsMetJunctionQueries,
    ];
    const subTablesQuery = [
      this.areasServedQueries,
      this.needsMetQueries,
      this.clientGroupsQueries,
    ];
    //now we delete them in order - we must away the promises to avoid race conditions
    try {
      await Promise.all(
        junctionTablesQuery.map((tableQuery) =>
          tableQuery.deleteBySingleCriteria("id", serviceId)
        )
      );
      await this.ServiceBaseQueries.deleteBySingleCriteria("id", serviceId);
      await Promise.all(
        subTablesQuery.map((tableQuery) =>
          tableQuery.deleteBySingleCriteria("id", serviceId)
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
}
