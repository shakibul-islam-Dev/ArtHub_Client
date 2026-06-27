"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsPage = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0" },
    { title: "Total Artists", value: "0" },
    { title: "Total Artworks Sold", value: "0" },
    { title: "Total Revenue", value: "$0" },
  ]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // ১. প্রতিটি এপিআই রুট থেকে আলাদাভাবে ডেটা ফেচ করা হচ্ছে
        const userRes = await fetch("http://localhost:5000/api/arthub/user");
        if (!userRes.ok) throw new Error(`User API failed: ${userRes.status}`);

        const artworkRes = await fetch(
          "http://localhost:5000/api/arthub/artwork",
        );
        if (!artworkRes.ok)
          throw new Error(`Artwork API failed: ${artworkRes.status}`);

        const transRes = await fetch(
          "http://localhost:5000/api/arthub/transactions",
        );
        if (!transRes.ok)
          throw new Error(`Transaction API failed: ${transRes.status}`);

        const usersData = await userRes.json();
        const artworksData = await artworkRes.json();
        const transData = await transRes.json();

        // ২. এপিআই রেসপন্স অবজেক্ট হলে সেখান থেকে অ্যারে ফরম্যাট নিশ্চিত করা
        const users = Array.isArray(usersData)
          ? usersData
          : usersData.data || usersData.users || [];
        const artworks = Array.isArray(artworksData)
          ? artworksData
          : artworksData.data || artworksData.artworks || [];
        const transactions = Array.isArray(transData)
          ? transData
          : transData.data || transData.transactions || [];

        // ৩. ক্যালকুলেশন লজিক
        const totalUsers = users.length;
        const totalArtists = users.filter(
          (user) => user.role === "artist",
        ).length;
        const totalArtworksSold = transactions.length;

        const totalRevenue = transactions.reduce(
          (sum, item) => sum + Number(item.amount || item.price || 0),
          0,
        );

        // ৪. টপ কার্ড স্ট্যাটাস আপডেট
        setStats([
          { title: "Total Users", value: totalUsers.toLocaleString() },
          { title: "Total Artists", value: totalArtists.toLocaleString() },
          {
            title: "Total Artworks Sold",
            value: totalArtworksSold.toLocaleString(),
          },
          {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
          },
        ]);

        // ৫. চার্টের জন্য মাস ভিত্তিক ডেটা ম্যাপ করা
        const monthlyMap = {};
        transactions.forEach((item) => {
          const dateStr = item.createdAt || item.date;
          if (dateStr) {
            const monthName = new Date(dateStr).toLocaleString("en-US", {
              month: "short",
            }); // যেমন: "Jan"
            const amount = Number(item.amount || item.price || 0);
            monthlyMap[monthName] = (monthlyMap[monthName] || 0) + amount;
          }
        });

        const monthsOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const formattedChartData = monthsOrder
          .filter(
            (month) =>
              monthlyMap[month] !== undefined ||
              Object.keys(monthlyMap).length === 0,
          )
          .map((month) => ({
            name: month,
            sales: monthlyMap[month] || 0,
          }));

        setChartData(
          formattedChartData.length > 0
            ? formattedChartData
            : [
                { name: "Jan", sales: 0 },
                { name: "Feb", sales: 0 },
                { name: "Mar", sales: 0 },
              ],
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 text-neutral-500">লোড হচ্ছে...</div>
    );
  if (error)
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;

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
              data={chartData}
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
