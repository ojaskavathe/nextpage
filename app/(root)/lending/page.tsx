import { LendingTable } from "@/components/lending-table";
import { fetchCheckouts } from "@/server/reports";

import { columns } from "./columns";

export default async function LendingPage() {
  const checkouts = await fetchCheckouts();

  return (
    <>
      <LendingTable
        columns={columns}
        data={checkouts}
        pageSize={10}
      />
    </>
  )
}

