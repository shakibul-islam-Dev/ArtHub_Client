"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4000 },
  { name: "May", sales: 7000 },
  { name: "Jun", sales: 6000 },
];

const stats = [
  { title: "Total Users", value: "1,240" },
  { title: "Total Artists", value: "350" },
  { title: "Total Artworks Sold", value: "8,920" },
  { title: "Total Revenue", value: "$124,500" },
];

const AnalyticsPage = () => {
  return (
    <div className="p-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-50">
        Analytics Overview
      </h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm transition-transform hover:shadow-md"
          >
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-neutral-700 dark:text-neutral-200">
          Revenue Trend
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-neutral-200 dark:text-neutral-800"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor" }}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor" }}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--background)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="currentColor"
                className="text-neutral-900 dark:text-neutral-100"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
