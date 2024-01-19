import { fetchPatron } from "@/server/patron";

import MiscRefundForm from "./refund-form";

export default async function MiscRefundPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  
  return (
    <MiscRefundForm patron={patron!} />
  )
}