"use client";

import Container from "@/src/compronent/shared/Container";
import { Activity } from "lucide-react";
import React from "react";
import useDropshippingAnalytics from "./useDropshippingAnalytics";
import DateRangePicker from "./DateRangePicker";
import StatsCards from "./StatsCards";
import AnalyticsCharts from "./AnalyticsCharts";
import DropshipperTable from "./DropshipperTable";
import ActivityFeed from "./ActivityFeed";

export default function DropshippingAnalytics() {
  const {
    loading,
    dateRange,
    setDateRange,
    customDates,
    setCustomDates,
    expandedDropshipper,
    setExpandedDropshipper,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    kpiCards,
    trendData,
    pipelineData,
    recentActivity,
    filteredDropshippers,
    totalPages,
    paginatedDropshippers,
    pipelineDataLength,
    trendDataLength,
  } = useDropshippingAnalytics();

  return (
    <section className="min-h-screen bg-slate-950 py-10 md:py-16 animate-in fade-in duration-700">
      <Container className="space-y-10 overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em]">
              <Activity className="w-4 h-4" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-[28px] md:text-4xl lg:text-5xl font-bold text-white tracking-tight lg:whitespace-nowrap">
              Dropshipping <span className="text-indigo-500">Analytics</span>
            </h1>
            <p className="text-gray-500 md:text-base xl:text-lg max-w-2xl text-sm">
              Monitor revenue streams, partner performance, and platform growth
              in real-time.
            </p>
          </div>

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDates={customDates}
            setCustomDates={setCustomDates}
          />
        </div>

        {/* Section 1: KPI Grid */}
        <StatsCards kpiCards={kpiCards} loading={loading} />

        {/* Section 2: Visual Charts Row */}
        <AnalyticsCharts
          loading={loading}
          trendData={trendData}
          pipelineData={pipelineData}
          trendDataLength={trendDataLength}
          pipelineDataLength={pipelineDataLength}
        />

        {/* Section 3: Performance Table */}
        <DropshipperTable
          loading={loading}
          filteredDropshippers={filteredDropshippers}
          paginatedDropshippers={paginatedDropshippers}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          expandedDropshipper={expandedDropshipper}
          setExpandedDropshipper={setExpandedDropshipper}
        />

        {/* Section 4: Activity Feed */}
        <ActivityFeed loading={loading} recentActivity={recentActivity} />
      </Container>
    </section>
  );
}
