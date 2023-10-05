import React, { FC } from "react";
import { IServiceReportEntry } from "../../../../types/serviceTypes/serviceReportTypes";
import envIndex from "../../../../envIndex/envIndex";

type Props = {
  report: IServiceReportEntry;
  setAllReports: React.Dispatch<
    React.SetStateAction<IServiceReportEntry[] | null>
  >;
};

const AdminServiceREportIndividual: FC<Props> = ({ report, setAllReports }) => {
  const updateStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectValue = e.target.value;
    if (
      !(
        selectValue === "declined" ||
        selectValue === "accepted" ||
        selectValue === "under review" ||
        selectValue === "submitted"
      )
    )
      return;
    try {
      const result = await fetch(
        `${envIndex.urls.baseUrl}/services/service/reports/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            reportId: report.id,
            reportStatus: selectValue,
          }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!result.ok) throw Error(result.statusText);

      setAllReports((prev) => {
        if (!prev) return prev;
        return prev.map((thisReport) => {
          if (thisReport.id !== report.id) return thisReport;
          return { ...thisReport, status: selectValue };
        });
      });
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <tr className="border-b-2 border-stone-500 border-solid">
      <td className="border-x-2 border-stone-500 border-solid px-1 text-center">
        {report.id}
      </td>
      <td className="border-x-2 border-stone-500 border-solid px-1 text-center">
        {report.report}
      </td>
      <td className="border-x-2 border-stone-500 border-solid px-1 text-center">
        {report.created_at}
      </td>
      <td className="border-x-2 border-stone-500 border-solid px-1 text-center">
        {report.userId}
      </td>
      <td className="border-x-2 border-stone-500 border-solid px-1 text-center">
        <select
          name="statusSelect"
          id="statusSelect"
          className="h-8 rounded-md cursor-pointer"
          defaultValue={report.status}
          onChange={updateStatus}
        >
          <option value="submitted">Submitted</option>
          <option value="under review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </td>
    </tr>
  );
};

export default AdminServiceREportIndividual;
