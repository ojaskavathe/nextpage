import { FollowupTable } from "./followup-table";

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
