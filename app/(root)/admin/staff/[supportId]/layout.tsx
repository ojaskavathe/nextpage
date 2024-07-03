import { fetchSupport } from "@/server/staff";

export default async function SupportPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { supportId: string };
}) {
  const support = await fetchSupport(params.supportId);

  if (!support) {
    return (
      <div className="text-3xl font-medium">
        No support with ID:{" "}
        <span className="font-bold">{params.supportId}</span>
      </div>
    );
  }

  return <>{children}</>;
}
