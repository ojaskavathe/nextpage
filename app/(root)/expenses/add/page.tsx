import { columns } from "./columns";
import { DataTable } from "@/components/table";
import ExpenseForm from "./expense-form";
import { getCategories, getExpenses } from "@/server/expenses";
import { auth } from "@/auth";

export default async function ExpensesPage() {
  const categories = await getCategories();
  const expenses = await getExpenses();

  const session = await auth();

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <ExpenseForm
        role={session!.user!.role}
        categories={categories}
        className="-mt-4 basis-1/3"
      />
      <DataTable
        title="Expenses"
        className="basis-2/3"
        columns={columns}
        data={expenses}
        pageSize={10}
      />
    </div>
  );
}
