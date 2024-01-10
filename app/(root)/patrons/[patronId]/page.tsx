import { z } from "zod";
import PatronUpdateForm from "./patron-form";
import { sr_id } from "@/lib/utils";
import { fetchPatron } from "@/server/patron";

export default async function PatronPage({ params }: { params: { patronId: string } }) {

  const id = parseInt(params.patronId);
  const patron = await fetchPatron( id );

  return (
    <>
      <PatronUpdateForm patron={patron!} />
    </>
  )
}
