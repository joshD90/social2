import { FC, useEffect, useState } from "react";

import NewOptionSubmitter from "./NewOptionSubmitter";
import {
  ISubServiceCategory,
  SubServiceCategory,
} from "../../types/serviceTypes/SubServiceCategories";

import useGetFetch from "../../hooks/useGetFetch";
import { createKey } from "../../pages/serviceDisplay/mapSubServiceToISubCategory";

type Props = {
  subCategoryName: SubServiceCategory;
  value: ISubServiceCategory[];
  updateField: (name: string, value: ISubServiceCategory[]) => void;
};

interface IDynamicObject {
  id: string;
  [param: string]: string;
}

const FormSubSelector: FC<Props> = ({
  subCategoryName,
  value,
  updateField,
}) => {
  //todo - create a backend endpoint
  const { fetchedData, error } = useGetFetch<IDynamicObject[]>(
    `http://localhost:3500/service/subCategories/${subCategoryName}`,
    []
  );

  const [options, setOptions] = useState<ISubServiceCategory[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<ISubServiceCategory[]>(
    []
  );
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [activeSelectedOptions, setSelectedActiveOptions] = useState<string[]>(
    []
  );

  //set data - this will be replaced by an api call once connected to backend
  useEffect(() => {
    if (!fetchedData) return;

    //we need to map the data into a usable form once we have fetch it
    const mappedData = fetchedData.map((dataItem) => ({
      value: dataItem[createKey(subCategoryName)],
      exclusive: false,
    }));

    setOptions(mappedData);
    if (!value || value.length === 0) return;
    //we want to be able to prepopulate if we are switching between stages of the form and keep our presaved data
    const unSelectedOptions = mappedData.filter(
      (option) => !value.find((value) => value.value === option.value)
    );

    setOptions(unSelectedOptions);
    setSelectedOptions(value);
  }, [subCategoryName, value, fetchedData]);

  //this handles the actual elements inside the HTML select that we have clicked
  const changeActive = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    //get our options into a string array format
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    if (e.target.id === "subSelector") setActiveOptions([...selectedOptions]);
    if (e.target.id === "subSelected")
      setSelectedActiveOptions([...selectedOptions]);
  };

  //we update the over all state and allow our use effect to do the transfer
  const updateOptions = (e: React.FormEvent, direction: "add" | "subtract") => {
    e.preventDefault();
    if (direction === "add") {
      const currentOptions = activeOptions.map((option) => ({
        value: option,
        exclusive: false,
      }));

      updateField(subCategoryName, [...selectedOptions, ...currentOptions]);
    }
    if (direction === "subtract") {
      const filteredSelectedOptions = selectedOptions.filter(
        (option) => !activeSelectedOptions.includes(option.value)
      );
      updateField(subCategoryName, filteredSelectedOptions);
    }
    setActiveOptions([]);
    setSelectedActiveOptions([]);
  };

  //handle the double click to set exclusive or not
  const handleExclusive = (value: string) => {
    const adjustedOptions = selectedOptions.map((opt) => {
      if (opt.value === value) return { ...opt, exclusive: !opt.exclusive };
      return opt;
    });
    setSelectedOptions(adjustedOptions);
  };

  return (
    <div className="bg-stone-300 rounded-md p-5 w-full">
      <p className="pb-5">{`After Selecting the Relevant Options for ${subCategoryName} double click any options that are an essential criteria for the service to be accessed`}</p>
      <form className="flex gap-5 mb-5">
        {/* select the options */}
        <div className="flex flex-col border-solid border-stone-500 border-2 rounded-sm w-48">
          {error === "" ? (
            <>
              <label htmlFor="subSelector">Select Multiple</label>
              <select
                name="subSelector"
                id="subSelector"
                multiple
                className="w-full h-full"
                onChange={changeActive}
              >
                {options.map((data) => (
                  <option
                    value={data.value}
                    key={data.value}
                    className="w-48 p-2"
                  >
                    {data.value}
                  </option>
                ))}
              </select>
            </>
          ) : (
            "There was an error in fetching categories"
          )}
        </div>
        {/* central buttons */}
        <div className="flex flex-col justify-center items-center gap-2 ">
          <button
            className="bg-gray-500 rounded-sm p-2 w-20"
            onClick={(e) => updateOptions(e, "add")}
          >
            Add
          </button>
          <button
            className="bg-gray-500 rounded-sm p-2 w-20"
            onClick={(e) => updateOptions(e, "subtract")}
          >
            Remove
          </button>
        </div>
        {/* selected options */}
        <div className="flex flex-col justify-start items-start border-solid border-stone-500 border-2 rounded-sm w-48">
          <div className="flex flex-col w-full h-full">
            <label htmlFor="subSelected">Selected Items</label>

            <select
              name="subSelected"
              id="subSelected"
              className="w-full h-full pr-10"
              multiple
              onChange={changeActive}
            >
              {selectedOptions.map((opt) => (
                <option
                  value={opt.value}
                  key={opt.value}
                  className={`w-48 p-2 ${opt.exclusive && "bg-green-500"}`}
                  onDoubleClick={() => handleExclusive(opt.value)}
                >
                  {opt.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <NewOptionSubmitter
        existingOptions={[...options, ...selectedOptions]}
        selectedOptions={selectedOptions}
        categoryName={subCategoryName}
        updateField={updateField}
      />
    </div>
  );
};

export default FormSubSelector;
