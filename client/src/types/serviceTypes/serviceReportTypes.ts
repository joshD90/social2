export interface IServiceReport {
  userId: number;
  serviceId: number;
  report: string;
  status?: "submitted" | "under review" | "completed" | "dismissed";
}
export interface IServiceReportEntry extends IServiceReport {
  id: number;
  created_at: string;
}
