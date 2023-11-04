import { FC, SetStateAction } from "react";
import SelectPrimitiveInput from "../../../microcomponents/inputs/SelectPrimitiveInput";
import useGetFetch from "../../../hooks/useGetFetch";
import envIndex from "../../../envIndex/envIndex";

type Props = {
  updateField: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string | number;
  inputError: { [key: string]: string };
  setInputError: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
};

const SelectParentService: FC<Props> = ({
  updateField,
  value,
  inputError,
  setInputError,
}) => {
  const { fetchedData } = useGetFetch<{ id: number; name: string }[]>(
    `${envIndex.urls.baseUrl}/services?minimal=true`,
    []
  );

  if (!fetchedData) return null;

  return (
    <SelectPrimitiveInput
      optionArray={fetchedData.map((service) => ({
        name: service.name,
        value: service.id,
      }))}
      label="Parent Service"
      name="parent_service"
      updateField={updateField}
      value={value}
      inputError={inputError}
      setInputError={setInputError}
    />
  );
};

export default SelectParentService;
