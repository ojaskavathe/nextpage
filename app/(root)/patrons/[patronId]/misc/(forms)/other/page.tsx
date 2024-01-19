import { fetchPatron } from "@/server/patron";

import MiscOtherForm from "./other-form";

export default async function MiscOtherPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  
  return (
    <MiscOtherForm patron={patron!} />
  )
}