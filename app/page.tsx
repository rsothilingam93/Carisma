"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const vehicleStatus = [
  { name: "In Stock", value: 820 },
  { name: "In Service", value: 310 },
  { name: "Sold", value: 154 },
];

const invoiceVolume = [
  { month: "Jan", invoices: 420 },
  { month: "Feb", invoices: 610 },
  { month: "Mar", invoices: 780 },
  { month: "Apr", invoices: 910 },
];

const COLORS = ["#10b981", "#38bdf8", "#f59e0b"];

export default function Home() {
  return (
    <div className="max-w-6xl">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          <span className="text-emerald-500">Carisma</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl">
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

      {/* Dashboard Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Pie Chart */}
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <h3 className="text-white font-semibold mb-4">
            Vehicle Status
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={vehicleStatus}
                dataKey="value"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {vehicleStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <h3 className="text-white font-semibold mb-4">
            Monthly Invoices
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={invoiceVolume}>
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="invoices"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
      <div className="text-sm text-gray-400 uppercase tracking-wide">
        {label}
      </div>
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
