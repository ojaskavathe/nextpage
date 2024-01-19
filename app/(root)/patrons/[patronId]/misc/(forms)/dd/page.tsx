import { fetchPatron } from "@/server/patron";

import MiscDDForm from "./dd-form";

export default async function MiscDDPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  // const {transactions, ...patronWithSub} = patron!
  
  return (
    <MiscDDForm patron={patron!} />
  )
}