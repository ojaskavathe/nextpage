import { fetchSupport } from "@/server/staff";
import SupportForm from "./supportForm";

export default async function SupportPage({
  params,
}: {
  children: React.ReactNode;
  params: { supportId: string };
}) {
  const support = await fetchSupport(params.supportId);

  return (
    <div className="w-full md:w-[425px]">
      <SupportForm support={support!} />
    </div>
  );
}
