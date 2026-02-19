"use client";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Schedule {
  id: string;
  job_name: string;
  employee: string;
  date: string;
  start_time: string;
  end_time: string;
  note?: string;
}

export default function SchedulingPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [form, setForm] = useState({
    job_name: "",
    employee: "",
    date: "",
    start_time: "",
    end_time: "",
    note: "",
  });

  useEffect(() => {
    fetchSchedules();

    // --- ADD: Realtime subscription ---
    const subscription = supabase
      .channel("public:schedules")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "schedules" },
        () => fetchSchedules()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    // --- END ADD ---
  }, []);

  async function fetchSchedules() {
    const { data, error } = await supabase
      .from<Schedule>("schedules")
      .select("*")
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) console.error("Supabase fetch error:", error.message);
    else setSchedules(data || []);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const { job_name, employee, date, start_time, end_time, note } = form;

    const { data, error } = await supabase.from("schedules").insert([
      {
        job_id: uuidv4(),
        job_name,
        employee,
        date,
        start_time,
        end_time,
        note,
      },
    ]);

    if (error) console.error("Supabase insert error:", error.message, error.details, error.hint);
    else {
      setForm({ job_name: "", employee: "", date: "", start_time: "", end_time: "", note: "" });
      fetchSchedules(); // refresh table immediately
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Scheduling</h1>
      <p className="text-gray-400 mb-6">Schedule jobs and assign employees.</p>

      {/* Add Job Form */}
      <form onSubmit={handleAdd} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Job Name"
          value={form.job_name}
          onChange={(e) => setForm({ ...form, job_name: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          placeholder="Employee"
          value={form.employee}
          onChange={(e) => setForm({ ...form, employee: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          type="time"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          placeholder="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
        />
        <button
          type="submit"
          className="col-span-full bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded"
        >
          Add Job
        </button>
      </form>

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-2">Job Name</th>
              <th className="p-2">Employee</th>
              <th className="p-2">Date</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border-b border-white/10">
                <td className="p-2">{s.job_name}</td>
                <td className="p-2">{s.employee}</td>
                <td className="p-2">{s.date}</td>
                <td className="p-2">{s.start_time}</td>
                <td className="p-2">{s.end_time}</td>
                <td className="p-2">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
