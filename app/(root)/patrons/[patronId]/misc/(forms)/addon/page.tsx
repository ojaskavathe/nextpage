import { fetchPatron } from "@/server/patron";

import MiscAddonForm from "./addon-form";

export default async function MiscDDPage({ params }: { params: { patronId: string } }) {
  const patron = await fetchPatron(parseInt(params.patronId));
  // const {transactions, ...patronWithSub} = patron!
  
  return (
    <MiscAddonForm patron={patron!} />
  )
}