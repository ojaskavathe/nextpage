import { fetchPatron } from "@/server/patron";

import MiscClosureForm from "./closure-form";

export default async function MiscRefundPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  
  return (
    <MiscClosureForm patron={patron!} />
  )
}
