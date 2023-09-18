import { FC } from "react";
import { IWeightedSearchedService } from "../../../types/searchTypes/searchServiceTypes";

type Props = { results: IWeightedSearchedService[]; searchQuery: string };

const SearchServiceResults: FC<Props> = ({ results, searchQuery }) => {
  // const regularExpression = new RegExp(`(?=${searchQuery})`, "gi");

  const generateHighLightedText = (str: string, partToHighlight: string) => {
    const regExPattern = new RegExp(`(${partToHighlight})`, "gi");
    const sections = str.split(regExPattern);
    console.log(sections);
    const highLightedText = sections.map((section, index) => {
      if (section.toLowerCase() === partToHighlight.toLowerCase()) {
        return (
          <i className="text-red-500" key={index}>
            {section}
          </i>
        );
      } else return section;
    });
    return highLightedText;
  };

  return (
    <div>
      {results.map((service) => (
        <div key={service.id}>
          <span>{service.id}</span>
          <p>{service.name}</p>
          <div>
            <p>Relevant Headers</p>
            {Object.entries(service.matchingHeaders).map(([key, value]) => {
              return (
                <span className="mr-3">
                  <b>{key}</b> :
                  <span>{generateHighLightedText(value, searchQuery)}</span>
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchServiceResults;
