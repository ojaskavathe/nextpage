import { FollowupTable } from "./followup-reports-table";

export default async function FootfallReport() {

  return (
    <>
      <FollowupTable
        title="Followup"
        pageSize={10}
      />
    </>
  )
}
