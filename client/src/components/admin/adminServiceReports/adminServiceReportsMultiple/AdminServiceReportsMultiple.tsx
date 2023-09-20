import { FC } from "react";
import useGetFetch from "../../../../hooks/useGetFetch";
import { IServiceReportEntry } from "../../../../types/serviceTypes/serviceReportTypes";
import AdminServiceREportIndividual from "../adminServiceReportIIndividual/AdminServiceReportIndividual";

type Props = { serviceId: string | boolean };

const AdminServiceReportsMultiple: FC<Props> = ({ serviceId }) => {
  const { fetchedData, error, loading } = useGetFetch<IServiceReportEntry[]>(
    `http://localhost:3500/service/service/reports?serviceId=${serviceId}`,
    []
  );

  if (loading || !fetchedData) return <div>...Loading</div>;
  if (error !== "") return <div>{error}</div>;
  return (
    <section>
      <table className="bg-stone-300 w-full">
        <thead>
          <tr className="border-2 border-solid border-stone-500">
            <th className="border-x-2 border-stone-500 border-solid">
              Report Id
            </th>
            <th className="border-x-2 border-stone-500 border-solid">
              Report Contents
            </th>
            <th className="border-x-2 border-stone-500 border-solid">
              Created At
            </th>
            <th className="border-x-2 border-stone-500 border-solid">
              User Id
            </th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.map((serviceReport) => (
            <AdminServiceREportIndividual
              report={serviceReport}
              key={serviceReport.id}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminServiceReportsMultiple;