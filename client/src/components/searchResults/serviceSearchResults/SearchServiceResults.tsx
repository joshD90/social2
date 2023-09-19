import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IWeightedSearchedService } from "../../../types/searchTypes/searchServiceTypes";

type Props = { results: IWeightedSearchedService[]; searchQuery: string };

const SearchServiceResults: FC<Props> = ({ results, searchQuery }) => {
  const navigate = useNavigate();

  const generateHighLightedText = (str: string, partToHighlight: string) => {
    const regExPattern = new RegExp(`(${partToHighlight})`, "gi");
    const sections = str.split(regExPattern);

    const highLightedText = sections.map((section, index) => {
      if (section.toLowerCase() === partToHighlight.toLowerCase()) {
        return (
          <i className="text-red-300" key={index}>
            {section}
          </i>
        );
      } else return section;
    });
    return highLightedText;
  };

  return (
    <div className="flex flex-col gap-3 text-stone-50 p-2 py-4">
      <h2 className="text-2xl text-center">Service Results</h2>
      {results.map((service) => (
        <div
          key={service.id}
          className="flex border-solid border-stone-50 border-2 p-2 bg-blue-950 cursor-pointer hover:bg-blue-900"
          onClick={() =>
            navigate(
              `/services/${service.category}/${service.forwardTo}?id=${service.id}`,
              { state: { returnToSearch: true } }
            )
          }
        >
          <div className="flex flex-col items-left justify-start gap-1 px-2 border-r-2 border-r-stone-50 w-24 flex-grow-0 flex-shrink-0">
            <p>{service.id}</p>
            <p>{service.name}</p>
            <p>{service.weight}</p>
          </div>
          <div className="flex flex-col p-2">
            <p className="font-bold">Relevant Headers</p>
            {Object.entries(service.matchingHeaders).map(([key, value]) => {
              return (
                <div className="mr-3" key={key}>
                  <b>{key}</b>:
                  <span> {generateHighLightedText(value, searchQuery)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchServiceResults;
