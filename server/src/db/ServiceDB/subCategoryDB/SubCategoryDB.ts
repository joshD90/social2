import { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { GeneralQueryGenerator } from "../../generalQueryGenerator/GeneralQueryGenerator";
import { initServiceTablesQueries as initQueryObj } from "../serviceInitDBQueries";
import {
  ISubServiceItem,
  SubCategoryTableSpecific,
  SubServiceKey,
  TAreasServed,
  TClientGroups,
  TNeedsMet,
} from "../../../types/serviceTypes/subServiceCategories";

export class SubCategoryDB {
  private connection: Pool;

  //Generic Query Class for Sub Tables
  private needsMetQueries: GeneralQueryGenerator;
  private clientGroupsQueries: GeneralQueryGenerator;
  private areasServedQueries: GeneralQueryGenerator;
  //Generic Query Class for Junction Tables
  private needsMetJunctionQueries: GeneralQueryGenerator;
  private clientGroupsJunctionQueries: GeneralQueryGenerator;
  private areasServedJunctionQueries: GeneralQueryGenerator;
  //construct fetch queries specific to service - not sure whether this is properly necessary not sure why this would be the case but anyways
  private subTableFetchQueries: Map<string, string>;

  constructor(connection: Pool) {
    this.connection = connection;
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
    //generate correct strings for fetching sub tables
    this.subTableFetchQueries = this.createSubTableFetchQuery();
    //initialise
    this.initialiseSubCategoryTables();
  }

  private async initialiseSubCategoryTables() {
    try {
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

  public async createAllSubCategories(
    serviceId: number,
    subCatArray: (TAreasServed | TNeedsMet | TClientGroups)[]
  ): Promise<boolean> {
    const successArray = await Promise.all(
      subCatArray.map((category) => {
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
      return false;
    }
    return true;
  }
  public async fetchAllSubCategories(serviceId: number) {
    try {
      const [needsMet] = await this.connection.execute<RowDataPacket[][]>(
        this.subTableFetchQueries.get("needsMet")!,
        [serviceId]
      );
      const [clientGroups] = await this.connection.execute<RowDataPacket[][]>(
        this.subTableFetchQueries.get("clientGroups")!,
        [serviceId]
      );
      const [areasServed] = await this.connection.execute<RowDataPacket[][]>(
        this.subTableFetchQueries.get("areasServed")!,
        [serviceId]
      );
      return { needsMet, clientGroups, areasServed };
    } catch (error) {
      console.log(error);
      return Error((error as Error).message);
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

      let subId: number;
      //if it does use this id else create a new entry
      if (existingEntry.length === 0) {
        const result = await generalTableQuery.createTableEntryFromPrimitives(
          formattedData
        );

        subId = result.insertId;
      } else if (existingEntry[0]?.id) {
        subId = parseInt(existingEntry[0].id);
      } else {
        throw Error(
          `Something Unexpected Happenend in checking whether sub category exists ${JSON.stringify(
            existingEntry
          )}`
        );
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

  //fetch all subCategory possibilities
  public async fetchAllSubCategoryEntries(tableName: SubServiceKey) {
    switch (tableName) {
      case "needsMet":
        return await this.needsMetQueries.findEntryBy();
      case "clientGroups":
        return await this.clientGroupsQueries.findEntryBy();
      case "areasServed":
        return await this.areasServedQueries.findEntryBy();
    }
  }

  public async deleteJunctionTablesForService(
    serviceId: number
  ): Promise<boolean> {
    const junctionTablesQuery = [
      this.areasServedJunctionQueries,
      this.clientGroupsJunctionQueries,
      this.needsMetJunctionQueries,
    ];
    try {
      await Promise.all(
        junctionTablesQuery.map((tableQuery) => {
          return tableQuery.deleteBySingleCriteria("service_id", serviceId);
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
