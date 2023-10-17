import React, { FC } from "react";
import envIndex from "../../../envIndex/envIndex";
import useGetFetch from "../../../hooks/useGetFetch";

type Props = {
  handleOrgSelection: (e: React.ChangeEvent<HTMLSelectElement>) => unknown;
};

const AdminOrganisationsSelector: FC<Props> = ({ handleOrgSelection }) => {
  const { fetchedData: organisationNames } = useGetFetch<{ name: string }[]>(
    `${envIndex.urls.baseUrl}/users/organisations`
  );
  return (
    <form className="justify-self-end">
      <div className="text-stone-50 flex gap-3">
        <label htmlFor="organisationSelect">Select Organisation</label>
        <select
          name="organisationSelect"
          className="text-stone-950"
          onChange={handleOrgSelection}
        >
          <option value="">None Selected</option>
          {organisationNames?.map((organisation) => (
            <option value={organisation.name} key={organisation.name}>
              {organisation.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default AdminOrganisationsSelector;
