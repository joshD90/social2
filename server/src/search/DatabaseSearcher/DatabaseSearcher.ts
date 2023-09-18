import { Pool } from "mysql2/promise";
import queryObj from "./databaseSearcherQueries";
import {
  ISearchedService,
  IWeightedSearchedService,
} from "../../types/searchTypes/serviceSearchTypes";
import { TIterableStringObj } from "../../types/userTypes/UserType";
import { TCategoryNames } from "../../types/categoryTypes/CategoryType";

export class DatabaseSearcher {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  public async searchServices(
    keyString: string
  ): Promise<IWeightedSearchedService[] | Error> {
    const lowerCaseKey = keyString.toLowerCase();
    try {
      const result = await this.connection.execute<ISearchedService[]>(
        queryObj.searchServicesQuery,
        this.replicateKeyString(lowerCaseKey)
      );
      const data = result[0];
      if (data.length === 0) return [];

      const weightedAndConcatonated = this.determineRelevantHeadersAndWeigh(
        data,
        lowerCaseKey
      );
      return weightedAndConcatonated.sort((a, b) => b.weight - a.weight);
    } catch (error) {
      return error as Error;
    }
  }
  //we weight and concatonate in the same function to avoid unnecessary overhead and to do more work while we are iterating
  public determineRelevantHeadersAndWeigh(
    services: ISearchedService[],
    keyword: string
  ) {
    const mappedSearched = services.map((service) => {
      //make it an iterable type
      const iterableService: {
        [key: string]: string | TCategoryNames | null | number;
      } = { ...service };
      const returnObj: TIterableStringObj = {};
      let weight = 0;
      Object.entries(iterableService).forEach(([key, value]) => {
        if (!(typeof value === "string")) return [key, value];
        const searchRangeValue = this.grabBeforeAndAfterSubStr(
          value,
          keyword,
          50
        );
        if (!searchRangeValue) return;
        returnObj[key] = searchRangeValue;
        weight += this.weighKey(key);
      });

      return {
        id: iterableService.id,
        name: iterableService.name as string,
        weight,
        matchingHeaders: { ...returnObj },
      };
    });
    return mappedSearched;
  }

  private grabBeforeAndAfterSubStr(
    stringToSlice: string,
    value: string,
    range: number
  ): string | undefined {
    const indexOfValue = stringToSlice.indexOf(value.toLowerCase());
    if (indexOfValue === -1) return undefined;
    const startIndex = indexOfValue - range < 0 ? 0 : indexOfValue - range;
    const endIndex =
      indexOfValue + value.length + range > stringToSlice.length - 1
        ? stringToSlice.length - 1
        : indexOfValue + range + value.length;
    return stringToSlice.slice(startIndex, endIndex);
  }

  private weighKey(key: string): number {
    switch (key) {
      case "name":
        return 9;
      case "organisation":
        return 8;
      case "description":
        return 7;
      case "referralPathway":
        return 6;
      case "needs_met":
        return 5;
      case "client_groups":
        return 4;
      case "areas_served":
        return 3;
      case "minRequirementsToAccess":
        return 2;
      case "organisation":
        return 1;
      default:
        return 0;
    }
  }

  private replicateKeyString = (searchParam: string) => {
    const modifiedSearchParam = `%${searchParam}%`;

    const replicateArray = [];
    for (let i = 0; i < 17; i++) {
      replicateArray.push(modifiedSearchParam);
    }
    console.log(replicateArray);
    return replicateArray;
  };
}
