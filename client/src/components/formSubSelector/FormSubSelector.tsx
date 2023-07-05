import { FC, SetStateAction, useState } from "react";
import NewOptionSubmitter from "./NewOptionSubmitter";
import { ISubServiceCategory } from "../../types/serviceTypes/SubServiceCategories";

const dummyData: ISubServiceCategory[] = [
  { value: "travellers", exclusive: false },
  { value: "men", exclusive: false },
  { value: "alcohol", exclusive: false },
  { value: "drugs", exclusive: false },
  { value: "adults", exclusive: false },
  { value: "women", exclusive: false },
];

const FormSubSelector: FC = () => {
  const [options, setOptions] = useState<ISubServiceCategory[]>(dummyData);
  const [selectedOptions, setSelectedOptions] = useState<ISubServiceCategory[]>(
    []
  );
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [activeSelectedOptions, setSelectedActiveOptions] = useState<string[]>(
    []
  );
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

  //this moves it from one panel to the other
  const transferOptions = (
    e: React.FormEvent,
    target: React.Dispatch<SetStateAction<ISubServiceCategory[]>>,
    source: React.Dispatch<SetStateAction<ISubServiceCategory[]>>,
    transferData: string[],
    setTransferData: React.Dispatch<SetStateAction<string[]>>
  ): void => {
    e.preventDefault();
    const mappedTransferData = transferData.map((el) => ({
      value: el,
      exclusive: false,
    }));
    target((prev) => [...prev, ...mappedTransferData]);
    source((prev) =>
      prev.filter((option) => !transferData.includes(option.value))
    );
    setTransferData([]);
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
    <div className="bg-stone-300 rounded-md p-5">
      <form className="flex gap-5 mb-5">
        {/* select the options */}
        <div className="flex flex-col border-solid border-stone-500 border-2 rounded-sm w-48">
          <label htmlFor="subSelector">Select Multiple</label>
          <select
            name="subSelector"
            id="subSelector"
            multiple
            className="w-full h-full"
            onChange={changeActive}
          >
            {options.map((data) => (
              <option value={data.value} key={data.value} className="w-48 p-2">
                {data.value}
              </option>
            ))}
          </select>
        </div>
        {/* central buttons */}
        <div className="flex flex-col justify-center items-center gap-2 ">
          <button
            className="bg-gray-500 rounded-sm p-2 w-20"
            onClick={(e) =>
              transferOptions(
                e,
                setSelectedOptions,
                setOptions,
                activeOptions,
                setActiveOptions
              )
            }
          >
            Add
          </button>
          <button
            className="bg-gray-500 rounded-sm p-2 w-20"
            onClick={(e) =>
              transferOptions(
                e,
                setOptions,
                setSelectedOptions,
                activeSelectedOptions,
                setSelectedActiveOptions
              )
            }
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
        setSelectedOption={setSelectedOptions}
      />
    </div>
  );
};

export default FormSubSelector;
