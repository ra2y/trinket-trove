"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    date: string;
    revenue: number;
  }[];
};

export function RevenueChart({ data }: Props) {
  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <XAxis
            dataKey="date"
            tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                })
            }
            />
          <YAxis />
            <Tooltip
            formatter={(value) => {
                if (typeof value !== "number") return value ?? "";
                return `$${(value / 100).toFixed(2)}`;
            }}
            />
          <Line type="monotone" dataKey="revenue" stroke="#000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}