"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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

/* ---------- Static invoice chart (unchanged) ---------- */
const invoiceVolume = [
  { month: "Jan", invoices: 420 },
  { month: "Feb", invoices: 610 },
  { month: "Mar", invoices: 780 },
  { month: "Apr", invoices: 910 },
];

/* ---------- Colors by status ---------- */
const STATUS_COLORS: Record<string, string> = {
  "In Stock": "#10b981",
  "In Service": "#38bdf8",
  Sold: "#f59e0b",
};

/* ---------- Types ---------- */
interface Schedule {
  id: string;
  job_name: string;
  employee: string;
  date: string;
  start_time: string;
  end_time: string;
  note?: string;
}

interface InventoryRow {
  status: string;
}

/* ---------- Helpers ---------- */
function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

/* ====================================================== */
/* ====================== PAGE ========================== */
/* ====================================================== */

export default function Home() {
  const [weekSchedules, setWeekSchedules] = useState<Schedule[]>([]);
  const [vehicleStatusData, setVehicleStatusData] = useState<
    { name: string; value: number }[]
  >([]);

  const weekDates = getWeekDates();

  useEffect(() => {
    fetchWeekSchedules();
    fetchVehicleStatus();
  }, []);

  /* ---------- Scheduling (unchanged) ---------- */
  async function fetchWeekSchedules() {
    const { data, error } = await supabase
      .from<Schedule>("schedules")
      .select("*")
      .gte("date", weekDates[0])
      .lte("date", weekDates[6])
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) console.error("Calendar fetch error:", error.message);
    else setWeekSchedules(data || []);
  }

  /* ---------- NEW: Vehicle status from inventory ---------- */
  async function fetchVehicleStatus() {
    const { data, error } = await supabase
      .from<InventoryRow>("inventory")
      .select("status");

    if (error) {
      console.error("Vehicle status fetch error:", error.message);
      return;
    }

    const counts: Record<string, number> = {};

    data?.forEach((row) => {
      counts[row.status] = (counts[row.status] || 0) + 1;
    });

    const chartData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));

    setVehicleStatusData(chartData);
  }

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
        <Stat
          label="Vehicles Tracked"
          value={String(
            vehicleStatusData.reduce((sum, s) => sum + s.value, 0)
          )}
        />
        <Stat label="Invoices Generated" value="9,432" />
        <Stat label="Active Shops" value="27" />
      </section>

      {/* Dashboard Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Vehicle Status Pie */}
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <h3 className="text-white font-semibold mb-4">Vehicle Status</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {vehicleStatusData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[entry.name] || "#71717a"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {vehicleStatusData.length === 0 && (
            <div className="text-sm text-gray-500 mt-4">
              No vehicles yet
            </div>
          )}
        </div>

        {/* Monthly Invoices */}
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
          <h3 className="text-white font-semibold mb-4">Monthly Invoices</h3>

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

      {/* Weekly Jobs Calendar */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-white mb-6">
          This Week’s Jobs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
          {weekDates.map((date) => (
            <div
              key={date}
              className="rounded-xl border border-white/10 bg-zinc-900 p-3"
            >
              <div className="text-sm font-semibold text-emerald-400 mb-3">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="space-y-2">
                {weekSchedules
                  .filter((s) => s.date === date)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg bg-zinc-800 border border-white/10 p-2"
                    >
                      <div className="text-sm font-semibold text-white">
                        {s.job_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {s.employee}
                      </div>
                      <div className="text-xs text-gray-500">
                        {s.start_time}–{s.end_time}
                      </div>
                    </div>
                  ))}

                {weekSchedules.filter((s) => s.date === date).length === 0 && (
                  <div className="text-xs text-gray-600 italic">
                    No jobs
                  </div>
                )}
              </div>
            </div>
          ))}
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

/* ---------- Components ---------- */

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

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6 transition hover:bg-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
