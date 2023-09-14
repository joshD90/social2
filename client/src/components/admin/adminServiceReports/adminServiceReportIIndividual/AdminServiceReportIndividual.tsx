import React, { FC } from "react";
import { IServiceReportEntry } from "../../../../types/serviceTypes/serviceReportTypes";

type Props = { report: IServiceReportEntry };

const AdminServiceREportIndividual: FC<Props> = ({ report }) => {
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
    </tr>
  );
};

export default AdminServiceREportIndividual;
