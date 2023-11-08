import { FC } from "react";
import useGetFetch from "../../../../hooks/useGetFetch";
import { IServiceReportEntry } from "../../../../types/serviceTypes/serviceReportTypes";
import AdminServiceReportIndividual from "../adminServiceReportIndividual/AdminServiceReportIndividual";
import envIndex from "../../../../envIndex/envIndex";

type Props = { serviceId: string | boolean };

const AdminServiceReportsMultiple: FC<Props> = ({ serviceId }) => {
  const { fetchedData, error, loading, setFetchedData } = useGetFetch<
    IServiceReportEntry[]
  >(
    `${envIndex.urls.baseUrl}/services/service/reports?serviceId=${serviceId}`,
    []
  );

  if (loading || !fetchedData) return <div>...Loading</div>;
  if (error !== "") return <div>{error}</div>;
  return (
    <section className="">
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
            <th className="border-x-2 border-stone-500 border-solid">Status</th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.map((serviceReport) => (
            <AdminServiceReportIndividual
              report={serviceReport}
              key={serviceReport.id}
              setAllReports={setFetchedData}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminServiceReportsMultiple;
