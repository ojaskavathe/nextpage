import { redirect } from "next/navigation";

export default async function PatronRenew({ params }: { params: { patronId: string } }) {
  redirect(`/patrons/${params.patronId}/misc/dd`)
}