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
  console.log(fetchedData, error, loading);

  if (loading || !fetchedData) return <div>...Loading</div>;
  if (error !== "") return <div>{error}</div>;
  return (
    <section>
      {fetchedData.map((serviceReport) => (
        <AdminServiceREportIndividual report={serviceReport} />
      ))}
    </section>
  );
};

export default AdminServiceReportsMultiple;
