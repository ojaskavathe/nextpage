import { columns } from "./columns";
import { DataTable } from "@/components/table";
import { getExpenseSummary } from "@/server/expenses";

export default async function ExpenseSummaryPage() {
  const expenseSummary = await getExpenseSummary();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <DataTable
        title="Report"
        className=""
        columns={columns}
        data={expenseSummary}
        pageSize={10}
      />
    </div>
  );
}
