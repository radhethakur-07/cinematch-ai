"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { GenreAffinity } from "@/types";

interface GenreRadarProps {
  affinities: GenreAffinity[];
}

export function GenreRadarChart({ affinities }: GenreRadarProps) {
  const data = affinities.map((a) => ({
    genre: a.genre_name,
    affinity: a.affinity_percentage,
  }));

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#232738" />
          <PolarAngleAxis dataKey="genre" stroke="#a1a1aa" fontSize={11} tick={{ fill: "#d4d4d8" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3f3f46" fontSize={10} />
          <Radar
            name="Affinity %"
            dataKey="affinity"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RatingsBarChartProps {
  distribution: {
    star_1: number;
    star_2: number;
    star_3: number;
    star_4: number;
    star_5: number;
  };
}

export function RatingsBarChart({ distribution }: RatingsBarChartProps) {
  const data = [
    { name: "1★", count: distribution.star_1 },
    { name: "2★", count: distribution.star_2 },
    { name: "3★", count: distribution.star_3 },
    { name: "4★", count: distribution.star_4 },
    { name: "5★", count: distribution.star_5 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#12141d", borderColor: "#232738", borderRadius: "8px", color: "#fff" }}
          />
          <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = ["#f43f5e", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6", "#64748b"];

interface GenrePieChartProps {
  genres: { genre: string; count: number; percentage: number }[];
}

export function GenrePieChart({ genres }: GenrePieChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genres}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
            nameKey="genre"
          >
            {genres.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#12141d", borderColor: "#232738", borderRadius: "8px", color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ActivityTrendChartProps {
  activity: { date: string; ratings_count: number; recommendations_count: number }[];
}

export function ActivityTrendChart({ activity }: ActivityTrendChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#232738" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
          <YAxis stroke="#71717a" fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: "#12141d", borderColor: "#232738", borderRadius: "8px", color: "#fff" }}
          />
          <Line type="monotone" dataKey="recommendations_count" name="Rec Requests" stroke="#06b6d4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ratings_count" name="Ratings" stroke="#f43f5e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
