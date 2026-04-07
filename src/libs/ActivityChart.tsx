"use client";
import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Data Dummy (Nanti bisa dipassing dari Parent)
const data = [
    { name: "Mon", study: 40 },
    { name: "Tue", study: 30 },
    { name: "Wed", study: 65 },
    { name: "Thu", study: 45 },
    { name: "Fri", study: 90 },
    { name: "Sat", study: 70 },
    { name: "Sun", study: 85 },
];

const ActivityChart = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Learning Activity</h3>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5F2DED" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#5F2DED" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="study"
                            stroke="#5F2DED"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorStudy)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityChart;