import { fetchPatron } from "@/server/patron";

import MiscLostForm from "./lost-form";

export default async function MiscLostPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  
  return (
    <MiscLostForm patron={patron!} />
  )
}