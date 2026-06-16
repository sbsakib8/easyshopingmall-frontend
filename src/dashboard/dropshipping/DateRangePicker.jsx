"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React from "react";

const dateRanges = [
  { id: "today", label: "Today" },
  { id: "7days", label: "7 Days" },
  { id: "30days", label: "30 Days" },
  { id: "all", label: "All Time" },
  { id: "custom", label: "Custom" },
];

const pickerSx = {
  "& .MuiInputBase-root": {
    bgcolor: "#0F172A",
    border: "none !important",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: { xs: "10px", md: "14px" },
    paddingRight: { xs: "4px", md: "8px" },

    "& fieldset": {
      borderColor: "#334155",
    },
    "&:hover fieldset": {
      borderColor: "#64748B",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#818CF8",
      boxShadow: "0 0 0 2px rgba(129, 140, 248, 0.3)",
    },
  },

  "& .MuiInputBase-input": {
    py: { xs: "0px", md: "8.5px" },
    px: { xs: "8px", md: "14px" },
  },

  "& .MuiInputLabel-root": {
    color: "#FFFFFF !important",
    fontSize: { xs: "10px", md: "14px" },
    transform: {
      xs: "translate(10px, 7px) scale(1)",
      md: "translate(14px, 9px) scale(1)",
    },
    "&.MuiInputLabel-shrink": {
      transform: {
        xs: "translate(14px, -8px) scale(0.8)",
        md: "translate(14px, -9px) scale(0.75)",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#C7D2FE !important",
  },

  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "#FFFFFF",
    fontSize: { xs: "1.1rem", md: "1.25rem" },
  },
};

export default function DateRangePicker({
  dateRange,
  setDateRange,
  customDates,
  setCustomDates,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-900/80 rounded-2xl border border-gray-800 shadow-xl flex items-center self-end overflow-hidden w-max">
        {dateRanges.map((range) => (
          <button
            key={range.id}
            onClick={() => setDateRange(range.id)}
            className={`flex-shrink-0 px-3 p-2 sm:px-5 sm:py-3 text-[10px] sm:text-sm font-semibold uppercase tracking-widest rounded-xl transition-all snap-center whitespace-nowrap active:scale-95 ${
              dateRange === range.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/80"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div
        className={dateRange === "custom" ? "" : "hidden"}
      >
        <div className="flex items-center justify-end gap-3 animate-in slide-in-from-right-4 duration-300">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={customDates.start ? dayjs(customDates.start) : null}
              onChange={(newValue) =>
                setCustomDates((prev) => ({ ...prev, start: newValue }))
              }
              slotProps={{
                textField: {
                  size: "small",
                  sx: pickerSx,
                },
              }}
            />

            <div className="w-4 h-[2px] bg-gray-700 rounded-full flex-shrink-0" />

            <DatePicker
              label="End Date"
              value={customDates.end ? dayjs(customDates.end) : null}
              onChange={(newValue) =>
                setCustomDates((prev) => ({ ...prev, end: newValue }))
              }
              slotProps={{
                textField: {
                  size: "small",
                  sx: pickerSx,
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}
