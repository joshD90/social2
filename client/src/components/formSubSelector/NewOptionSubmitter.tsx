import React, { FC, SetStateAction, useState } from "react";
import { fuzzySearch } from "../../utils/wordMatching/fuzzySearch";
import { ISubServiceCategory } from "../../types/serviceTypes/SubServiceCategories";

type Props = {
  existingOptions: ISubServiceCategory[];
  setSelectedOption: React.Dispatch<SetStateAction<ISubServiceCategory[]>>;
};

const NewOptionSubmitter: FC<Props> = ({
  existingOptions,
  setSelectedOption,
}) => {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const addEnteredOption = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("doing something");
    //map into string array
    const mappedOptions = existingOptions.map((option) => option.value);
    if (currentInput.length < 2) return;
    //check to see if it's similar to existing entries
    const fuzzySearchResult = fuzzySearch(currentInput, mappedOptions);

    if (fuzzySearchResult.length > 0) {
      console.log("matching");
      setError(
        `"${currentInput}" is very similar to existing entry "${fuzzySearchResult[0]}"`
      );
      return;
    }
    //if not already there go ahead with adding
    setError("");
    setSelectedOption((prev) => [
      ...prev,
      { value: currentInput, exclusive: false },
    ]);
    setCurrentInput("");
  };

  return (
    <div>
      <form onSubmit={addEnteredOption}>
        <div className="flex flex-col">
          <label htmlFor="">Enter New Option and Press Enter</label>
          <input
            type="text"
            onChange={(e) => setCurrentInput(e.target.value)}
            className="p-2"
            value={currentInput}
          />
        </div>
        <span className="text-red-600">{error}</span>
      </form>
    </div>
  );
};

export default NewOptionSubmitter;
