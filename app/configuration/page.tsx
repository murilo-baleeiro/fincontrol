import InboundGroup from "./_components/InboundGroup";
import OutboundGroup from "./_components/OutboundGroup";
import PaymentsGroup from "./_components/PaymentsGroup";

export default function ConfigurationPage() {
  return (
    <main className="w-full h-full flex flex-col gap-4">
      <InboundGroup />
      <OutboundGroup />
      <PaymentsGroup />
    </main>
  );
}
