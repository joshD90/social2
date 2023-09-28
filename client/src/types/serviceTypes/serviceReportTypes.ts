export interface IServiceReport {
  userId: number;
  serviceId: number;
  report: string;
  status?: "submitted" | "under review" | "accepted" | "declined";
}
export interface IServiceReportEntry extends IServiceReport {
  id: number;
  created_at: string;
  updated_at: string;
}
