import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
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
  //construct fetch queries specific to service
  private fetchSubTableQueries: Map<string, string>;
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
    this.fetchSubTableQueries = this.createSubTableFetchQuery();
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
    const connection = await this.connection.getConnection();
    connection.beginTransaction();
    try {
      //make our base table before proceeding
      const baseResult =
        await this.ServiceBaseQueries.createTableEntryFromPrimitives(
          baseData as unknown as IGenericIterableObject
        );
      if (baseResult instanceof Error)
        throw new Error("Could not make the base table for service");

      const serviceId = baseResult.insertId;

      // //now that we have made our base table entry we can create our sub directories
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
      connection.commit();
      console.log(baseResult);
      return baseResult;
    } catch (error) {
      console.log(error);
      connection.rollback();
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
        return this.addSubCategory(specificTableVar, entry, serviceId);
      })
    );
    if (successArray.some((el) => el === "failure")) return "failure";
    return "success";
  }

  //create one subCategory Entry
  public async addSubCategory(
    specificTableVar: SubCategoryTableSpecific,
    data: ISubServiceItem,
    serviceId: number
  ): Promise<"success" | "failure"> {
    const generalTableQuery = specificTableVar.tableQueries;
    const junctionTableQuery = specificTableVar.junctionTableQueries;
    const subTable = specificTableVar.tableName;
    const fieldName = specificTableVar.fieldName;
    //we need to change the format to fit the general table query.
    const formattedData = { [fieldName]: data.value };

    try {
      //see does this entry already exist
      const existingEntry = await generalTableQuery.findEntryBy(
        specificTableVar.fieldName,
        data.value
      );
      if (existingEntry instanceof Error) throw Error(existingEntry.message);
      let subId: number;
      //if it does use this id else create a new entry
      if (existingEntry[0]?.id) {
        subId = parseInt(existingEntry[0].id);
      } else {
        const result = await generalTableQuery.createTableEntryFromPrimitives(
          formattedData
        );
        if (result instanceof Error)
          throw new Error("Could not create the Sub Directory");
        subId = result.insertId;
      }

      //take the id from the result and use this for the junction table
      //prepare our data
      const refColName = this.generateRefColNameJunc(subTable as SubServiceKey);
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
    let tableName: SubServiceKey;
    let fieldName: string;
    if (Object.keys(subCategory)[0] === "areasServed") {
      tableQueries = this.areasServedQueries;
      junctionTableQueries = this.areasServedJunctionQueries;
      tableName = SubServiceKey.AreasServed;
      fieldName = "area";
    } else if (Object.keys(subCategory)[0] === "clientGroups") {
      tableQueries = this.clientGroupsQueries;
      junctionTableQueries = this.clientGroupsJunctionQueries;
      tableName = SubServiceKey.ClientGroups;
      fieldName = "groupName";
    } else {
      tableQueries = this.needsMetQueries;
      junctionTableQueries = this.needsMetJunctionQueries;
      tableName = SubServiceKey.NeedsMet;
      fieldName = "need";
    }
    return { tableQueries, junctionTableQueries, tableName, fieldName };
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

  //fetch service and related sub categories
  public async fetchServiceAndRelatedEntries(serviceId: number) {
    try {
      const baseService = await this.ServiceBaseQueries.findEntryBy(
        "id",
        serviceId
      );
      if (baseService instanceof Error) return null;
      const [needsMet] = await this.connection.execute<RowDataPacket[][]>(
        this.fetchSubTableQueries.get("needsMet")!,
        [serviceId]
      );
      const [clientGroups] = await this.connection.execute<RowDataPacket[][]>(
        this.fetchSubTableQueries.get("clientGroups")!,
        [serviceId]
      );
      const [areasServed] = await this.connection.execute<RowDataPacket[][]>(
        this.fetchSubTableQueries.get("areasServed")!,
        [serviceId]
      );
      console.log(baseService, needsMet, areasServed, clientGroups);
      return { baseService, needsMet, areasServed, clientGroups };
    } catch (error) {
      return error;
    }
  }

  public createSubTableFetchQuery(): Map<string, string> {
    const queryMap = new Map<string, string>();
    queryMap.set(
      "needsMet",
      "SELECT need, exclusive FROM service_needs JOIN needsMet ON service_needs.need_id = needsMet.id WHERE service_id = ?;"
    );
    queryMap.set(
      "clientGroups",
      "SELECT groupName, exclusive FROM service_clientGroups JOIN clientGroups ON service_clientGroups.clientGroup_id = clientGroups.id WHERE service_id = ?"
    );
    queryMap.set(
      "areasServed",
      "SELECT area, exclusive FROM service_areas JOIN areasServed ON service_areas.area_id = areasServed.id WHERE service_id = ?"
    );
    return queryMap;
  }
}
