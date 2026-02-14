export default function Home() {
  return (
    <div className="max-w-6xl">
      {/* Hero */}
      <section className="mb-16">
      <h1 className="text-5xl font-extrabold tracking-tight mb-6">
        <span className="text-emerald-600">Carisma</span>
      </h1>


        <p className="text-xl text-gray-600 max-w-2xl">
          Modern inventory and invoicing software built specifically for
          auto shops, garages, and dealerships.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        <Stat label="Vehicles Tracked" value="1,284" />
        <Stat label="Invoices Generated" value="9,432" />
        <Stat label="Active Shops" value="27" />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Feature
          title="Inventory Management"
          desc="Track vehicles, parts, and availability in real time with a clean, intuitive interface."
        />
        <Feature
          title="Fast Invoicing"
          desc="Create professional invoices in seconds and keep everything organized."
        />
        <Feature
          title="Built for Speed"
          desc="No clutter, no bloat — just the tools shops actually need."
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 px-6 py-5">
      <div className="text-3xl font-semibold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  );
}



function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 transition hover:bg-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
