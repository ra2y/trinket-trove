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
    orders: number;
  }[];
};

export function OrdersChart({ data }: Props) {
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
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}