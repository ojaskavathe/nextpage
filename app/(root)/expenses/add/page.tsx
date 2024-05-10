import { columns } from "./columns";
import { DataTable } from "@/components/table";
import { fetchSupport } from "@/server/staff";
import ExpenseForm from "./expense-form";
import { getCategories } from "@/server/expenses";

export default async function AdminStaff() {
  const support = await fetchSupport();
  const categories = await getCategories();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <ExpenseForm categories={categories} className="basis-1/3"/>
      <DataTable
        className="basis-2/3"
        columns={columns}
        data={support}
        pageSize={10}
      />
    </div>
  )
}
