import { columns } from "./columns";
import { DataTable } from "@/components/table";
import CashReportForm from "./cash-report-form";
import { getCashReports } from "@/server/expenses";

export default async function ExpensesPage() {
  const cashReports = await getCashReports();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <CashReportForm
        className="-mt-4 basis-1/3"
      />
      <DataTable
        title="Report"
        className="basis-2/3"
        columns={columns}
        data={cashReports}
        pageSize={10}
      />
    </div>
  );
}
