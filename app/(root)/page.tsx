import { DummyComponent } from "@/components/dummy";
import { getSheetData } from "@/server/sheets";

export default async function PatronDetails() {
  const data = await getSheetData();

  return (
    <>
      <DummyComponent data={data} />
    </>
  )
}
