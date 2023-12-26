import { z } from "zod";
import PatronUpdateForm from "./patron-form";
import { sr_id } from "@/lib/utils";
import { fetchPatron } from "@/server";

export default async function PatronPage({ params }: { params: { patronId: string } }) {

  const id = parseInt(params.patronId);
  if (!z.number().safeParse(id).success) {
    return (
      <div className="text-3xl font-medium">Invalid ID: <span className="font-bold">{params.patronId}</span></div>
    )
  }

  const patron = await fetchPatron( id );
  if (!patron) {
    return (
      <div className="text-3xl font-medium">No patron with ID: <span className="font-bold">{sr_id(id)}</span></div>
    )
  }

  return (
    <>
      <PatronUpdateForm patron={patron}/>
    </>
  )
}
