import React, { FC } from "react";
import { IServiceReportEntry } from "../../../../types/serviceTypes/serviceReportTypes";

type Props = { report: IServiceReportEntry };

const AdminServiceREportIndividual: FC<Props> = ({ report }) => {
  return (
    <div className="w-full flex border-2 border-solid border-stone-500">
      <div className="flex-1">{report.id}</div>
      <div className="flex-3">{report.report}</div>
      <div className="flex-1">{report.created_at}</div>
      <div className="flex-1">{report.userId}</div>
    </div>
  );
};

export default AdminServiceREportIndividual;
