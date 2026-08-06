"use client";

import * as React from "react";

// ─── Field ────────────────────────────────────────────────────────────────

export function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 min-w-0">
      <label className="field-label">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">{children}</div>;
}

// ─── SectionTitle ─────────────────────────────────────────────────────────

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a6b5a]">
        {children}
      </h3>
      <span className="h-px flex-1 bg-gradient-to-r from-[#d8dbd1] to-transparent" />
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────

export function Select({
  value, onChange, children,
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-lg border border-[#d8dbd1] bg-white py-2.5 pl-3 pr-8 text-sm text-[#1b3629] shadow-xs outline-none transition focus:border-[#1b3629] focus:ring-1 focus:ring-[#1b3629]/20"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#4a6b5a]"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────

export function Toggle({
  value, onChange, labelOn, labelOff,
}: { value: boolean; onChange: (v: boolean) => void; labelOn: string; labelOff: string }) {
  return (
    <div className="flex gap-2">
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
            value === v
              ? "border-[#1b3629] bg-[#eef0eb] text-[#1b3629]"
              : "border-[#d8dbd1] bg-white text-[#6b7a70] hover:border-[#1b3629]/30"
          }`}
        >
          {v ? labelOn : labelOff}
        </button>
      ))}
    </div>
  );
}

// ─── AreaInput ────────────────────────────────────────────────────────────

export function AreaInput({
  value, onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-[#d8dbd1] bg-white px-3 focus-within:border-[#1b3629] focus-within:ring-1 focus-within:ring-[#1b3629]/20">
      <input
        type="number"
        min={0}
        step={0.01}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="0"
        className="flex-1 bg-transparent py-2.5 text-sm text-[#1b3629] outline-none placeholder:text-[#b0bdb5]"
      />
      <span className="text-xs font-semibold text-[#8a9890]">m²</span>
    </div>
  );
}

// ─── ToggleSection ────────────────────────────────────────────────────────

export function ToggleSection({
  label, active, onToggle, children,
}: { label: string; active: boolean; onToggle: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border transition-all ${active ? "border-[#c5d9c8] bg-white" : "border-[#e8eae3] bg-[#f9faf7]"}`}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => onToggle(!active)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className={`text-sm font-semibold ${active ? "text-[#1b3629]" : "text-[#6b7a70]"}`}>
          {label}
        </span>
        {/* Switch */}
        <span
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${
            active ? "bg-[#1b3629]" : "bg-[#d8dbd1]"
          }`}
        >
          <span
            className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
              active ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>

      {/* Conditional content */}
      {active && (
        <div className="border-t border-[#eef0eb] px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── StepFooter ──────────────────────────────────────────────────────────

export function StepFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-[#eef0eb] pt-6">
      {children}
    </div>
  );
}
