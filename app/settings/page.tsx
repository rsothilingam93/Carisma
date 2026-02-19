"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [businessName, setBusinessName] = useState("Carisma Auto Group");

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Application and shop configuration.
        </p>
      </div>

      {/* Account */}
      <section className="rounded-xl border border-white/10 bg-zinc-900 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Account</h2>

        <div>
          <label className="text-sm text-gray-400">Tenant ID</label>
          <input
            disabled
            value="tenant_9f23a1c8"
            className="mt-1 w-full rounded-md bg-zinc-800 border border-white/10 px-3 py-2 text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Business Name</label>
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-1 w-full rounded-md bg-zinc-800 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-xl border border-white/10 bg-zinc-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Preferences</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Dark Mode</p>
            <p className="text-sm text-gray-400">
              Toggle light / dark appearance
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full transition ${
              darkMode ? "bg-emerald-600" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transform transition ${
                darkMode ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-xl border border-white/10 bg-zinc-900 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Security</h2>

        <input
          type="password"
          placeholder="Current password"
          className="w-full rounded-md bg-zinc-800 border border-white/10 px-3 py-2 text-white"
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full rounded-md bg-zinc-800 border border-white/10 px-3 py-2 text-white"
        />

        <button className="mt-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition">
          Update Password
        </button>
      </section>
    </div>
  );
}
