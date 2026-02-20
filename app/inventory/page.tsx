"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

interface InventoryItem {
  id: string;
  vehicle_name: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_vin: string;
  status: string;
  location: string;
  quantity: number;
  notes?: string;
  created_at: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState({
    vehicle_name: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_vin: "",
    status: "In Stock",
    location: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    const { data, error } = await supabase
      .from<InventoryItem>("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Inventory fetch error:", error.message);
    } else {
      setItems(data || []);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    const {
      vehicle_name,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_vin,
      status,
      location,
      quantity,
      notes,
    } = form;

    const { error } = await supabase.from("inventory").insert([
      {
        id: uuidv4(),
        vehicle_name,
        vehicle_make,
        vehicle_model,
        vehicle_year: Number(vehicle_year),
        vehicle_vin,
        status,
        location,
        quantity,
        notes,
            },
    ]);

    if (error) {
      console.error(
        "Supabase insert error:",
        error.message,
        error.details,
        error.hint
      );
    } else {
      setForm({
        vehicle_name: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: "",
        vehicle_vin: "",
        status: "In Stock",
        location: "",
        quantity: 1,
        notes: "",
      });
      fetchInventory(); // always reflect DB state
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Inventory</h1>
      <p className="text-gray-400 mb-6">
        Track vehicles and inventory status.
      </p>

      {/* Add Inventory Form */}
      <form
        onSubmit={handleAdd}
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          placeholder="Vehicle Name"
          value={form.vehicle_name}
          onChange={(e) =>
            setForm({ ...form, vehicle_name: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          placeholder="Make"
          value={form.vehicle_make}
          onChange={(e) =>
            setForm({ ...form, vehicle_make: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          placeholder="Model"
          value={form.vehicle_model}
          onChange={(e) =>
            setForm({ ...form, vehicle_model: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          type="number"
          placeholder="Year"
          value={form.vehicle_year}
          onChange={(e) =>
            setForm({ ...form, vehicle_year: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          placeholder="VIN"
          value={form.vehicle_vin}
          onChange={(e) =>
            setForm({ ...form, vehicle_vin: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white"
        >
          <option>In Stock</option>
          <option>In Service</option>
          <option>Sold</option>
        </select>

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
          className="p-2 rounded bg-zinc-800 text-white"
          required
        />

        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="p-2 rounded bg-zinc-800 text-white col-span-full"
        />

        <button
          type="submit"
          className="col-span-full bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded"
        >
          Add Vehicle
        </button>
      </form>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-2">Vehicle</th>
              <th className="p-2">Make / Model</th>
              <th className="p-2">Year</th>
              <th className="p-2">VIN</th>
              <th className="p-2">Status</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-white/10">
                <td className="p-2">{i.vehicle_name}</td>
                <td className="p-2">
                  {i.vehicle_make} {i.vehicle_model}
                </td>
                <td className="p-2">{i.vehicle_year}</td>
                <td className="p-2 font-mono text-sm">
                  {i.vehicle_vin}
                </td>
                <td className="p-2">{i.status}</td>
                <td className="p-2">{i.quantity}</td>
                <td className="p-2">{i.location}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-gray-500 text-sm mt-4">
            No inventory yet.
          </div>
        )}
      </div>
    </div>
  );
}
