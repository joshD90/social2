import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { initServiceTablesQueries as initQueryObj } from "./serviceInitDBQueries";
import {
  fetchAllChildrenServices,
  fetchAllServicesMinimal,
  fetchServices,
} from "./serviceSQLQueries";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { SubCategoryDB } from "./subCategoryDB/SubCategoryDB";

import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import {
  TAreasServed,
  TClientGroups,
  TNeedsMet,
} from "../../types/serviceTypes/subServiceCategories";
import {
  IService,
  IServiceEmailContact,
  IServicePhoneContact,
} from "../../types/serviceTypes/ServiceType";
import queryObj from "../ServiceReportDB/serviceReportQueries";
import ServiceContactsDB from "../ServiceContactsDB/ServiceContactsDB";
import { IUser } from "../../types/userTypes/UserType";
import { ServiceEmailContactsDB } from "../ServiceEmailsDB/ServiceEmailsDb";
import { db } from "../../server";

export class ServiceDB {
  private connection: Pool;
  //queries for our Base information
  private ServiceBaseQueries: GeneralQueryGenerator;
  //Class for SubCategory
  private SubCategoryDB: SubCategoryDB;
  //Generic Query Class for Report Table
  private serviceReportsQueries: GeneralQueryGenerator;
  // Phone Contacts DB class
  private serviceContactsDB: ServiceContactsDB;
  //email contacts DB class
  private serviceEmailsDB: ServiceEmailContactsDB;

  constructor(connection: Pool) {
    this.connection = connection;
    //queries for our Base information
    this.ServiceBaseQueries = new GeneralQueryGenerator("services", connection);
    //generate our subcategory and contacts db class
    this.SubCategoryDB = new SubCategoryDB(connection);
    this.serviceContactsDB = new ServiceContactsDB(connection);
    this.serviceEmailsDB = new ServiceEmailContactsDB(connection);
    //generate our generic service report queries TODO: create a seperate report class for this
    this.serviceReportsQueries = new GeneralQueryGenerator(
      "serviceReports",
      connection
    );
  }
  //create all our tables if they don't exist already
  public async initialiseServiceRelatedTables(): Promise<void> {
    try {
      //main tables
      await this.connection.query(initQueryObj.createCategoriesTable);
      await this.connection.query(initQueryObj.createServicesTable);
    } catch (error) {
      console.log(error);
    }
  }

  //this compacts all the methods involved in creating the multiple tables associated with a service
  public async createFullServiceEntry(
    baseData: IService,
    phoneContactData: IServicePhoneContact[],
    emailContactData: IServiceEmailContact[],
    subCategories: (TAreasServed | TNeedsMet | TClientGroups)[]
  ): Promise<ResultSetHeader | Error> {
    const connection = await this.connection.getConnection();
    await connection.beginTransaction();
    try {
      //make our base table before proceeding
      const baseResult =
        await this.ServiceBaseQueries.createTableEntryFromPrimitives(
          baseData as unknown as IGenericIterableObject,
          connection
        );

      const serviceId = baseResult.insertId;

      //now make our contacts
      const phoneContactDataWithServiceId = phoneContactData.map((contact) => ({
        ...contact,
        service_id: serviceId,
      }));
      await this.serviceContactsDB.insertPhoneContacts(
        phoneContactDataWithServiceId,
        connection
      );
      //insert our emails
      const emailContactDataWithServiceId = emailContactData.map((contact) => ({
        ...contact,
        service_id: serviceId,
      }));
      await this.serviceEmailsDB.insertMultipleEmails(
        emailContactDataWithServiceId,
        connection
      );
      // //now that we have made our base table entry we can create our sub directories
      const createSubCategoriesSuccess =
        await this.SubCategoryDB.createAllSubCategories(
          serviceId,
          subCategories,
          connection
        );
      if (!createSubCategoriesSuccess)
        throw Error("Could not create sub categories");
      //commit all the changes if there are no errors
      await connection.commit();

      return baseResult;
    } catch (error) {
      await connection.rollback();
      return error as Error;
    }
  }

  //delete all documents related to a single serviceId
  public async deleteServiceAndRelatedEntries(
    serviceId: number
  ): Promise<true | Error> {
    //now we delete them in order - we must await the promises to avoid race conditions
    const connection = await this.connection.getConnection();
    try {
      await connection.beginTransaction();
      const deletedJunctionTables =
        await this.SubCategoryDB.deleteJunctionTablesForService(
          serviceId,
          connection
        );
      if (!deletedJunctionTables)
        throw Error("Could Not Delete Junction Tables");

      await this.serviceReportsQueries.deleteBySingleCriteria(
        "serviceId",
        serviceId,
        connection
      );

      await this.ServiceBaseQueries.deleteBySingleCriteria(
        "id",
        serviceId,
        connection
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      if (
        error instanceof Error &&
        error.message === "There was no record matching that criteria"
      )
        return true;
      return error as Error;
    }
  }

  //fetch service and related sub categories
  public async fetchServiceAndRelatedEntries(
    serviceId: number,
    user: IUser | null
  ) {
    try {
      const [baseService] = await this.connection.execute<RowDataPacket[]>(
        fetchServices(serviceId),
        [serviceId]
      );

      //get contact numbers but filter out private ones if user is not approved or higher
      let contactNumbers = await this.serviceContactsDB.fetchPhoneContacts(
        serviceId
      );
      let emailContacts = await this.serviceEmailsDB.fetchEmailContacts(
        serviceId
      );

      if (
        user?.privileges !== "admin" &&
        user?.privileges !== "moderator" &&
        user?.privileges !== "approved"
      ) {
        contactNumbers = contactNumbers.filter((number) => number.public);
        emailContacts = emailContacts.filter((email) => email.public);
      }

      const allSubCategories = await this.SubCategoryDB.fetchAllSubCategories(
        serviceId
      );
      if (allSubCategories instanceof Error)
        throw Error("Error in fetching sub categories");
      const allChildren = await this.fetchAllChildrenServices(serviceId);

      const serviceImages = await db
        .getImagesDB()
        .getImageSignedUrlsByService(serviceId);

      return {
        baseService,
        children: allChildren,
        contactNumber: contactNumbers,
        emailContacts: emailContacts,
        images: serviceImages,
        ...allSubCategories,
      };
    } catch (error) {
      return error;
    }
  }

  public async fetchAllServices() {
    const [result] = await this.connection.execute<RowDataPacket[]>(
      fetchServices()
    );
    return result;
  }

  public async fetchAllChildrenServices(
    parent_id: number
  ): Promise<RowDataPacket[]> {
    const [result] = await this.connection.execute<RowDataPacket[]>(
      fetchAllChildrenServices,
      [parent_id]
    );
    return result;
  }

  public async fetchServicesMinimal() {
    const [result] = await this.connection.execute<RowDataPacket[]>(
      fetchAllServicesMinimal
    );
    return result;
  }

  //basic getters and setters
  public getBaseTableQueries(): GeneralQueryGenerator {
    return this.ServiceBaseQueries;
  }
  public getSubCategoryDB(): SubCategoryDB {
    return this.SubCategoryDB;
  }
  public getBaseTableColumnNames() {
    this.ServiceBaseQueries.getTableColumnNames("services");
  }
  public getContactNumberDB(): ServiceContactsDB {
    return this.serviceContactsDB;
  }
  public getContactEmailDB(): ServiceEmailContactsDB {
    return this.serviceEmailsDB;
  }
}
