import { dailyColumns } from "./columns/daily";
import { DataTable } from "@/components/table";
import { fetchDailyCollection, fetchMontlyCollection, fetchYearlyCollection } from "@/server/summary";
import { monthlyColumns } from "./columns/monthly";
import { yearlyColumns } from "./columns/yearly";

export default async function TransactionReport() {
  const dailyCollection = await fetchDailyCollection();
  const monthlyCollection = await fetchMontlyCollection();
  const yearlyCollection = await fetchYearlyCollection();

  return (
    <div className="flex space-x-4">
      <DataTable
        title="Daily"
        columns={dailyColumns}
        data={dailyCollection!}
        pageSize={10}
      />
      <DataTable
        title="Montly"
        columns={monthlyColumns}
        data={monthlyCollection!}
        pageSize={10}
      />
      <DataTable
        title="Yearly"
        columns={yearlyColumns}
        data={yearlyCollection!}
        pageSize={12}
      />
    </div>
  );
}
