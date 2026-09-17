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
    <div className="w-full h-60 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="#202329" />
          <PolarAngleAxis dataKey="genre" stroke="#94959A" fontSize={11} tick={{ fill: "#C1C0BC" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#292C33" fontSize={10} />
          <Radar
            name="Affinity %"
            dataKey="affinity"
            stroke="#D94B56"
            fill="#D94B56"
            fillOpacity={0.25}
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
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="#94959A" fontSize={11} />
          <YAxis stroke="#94959A" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#101216", borderColor: "#292C33", borderRadius: "8px", color: "#F4F2ED" }}
          />
          <Bar dataKey="count" fill="#D6B56D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const RESTRAINED_COLORS = ["#D94B56", "#D6B56D", "#7E9BB7", "#6FA884", "#B83B46", "#C1C0BC"];

interface GenrePieChartProps {
  genres: { genre: string; count: number; percentage: number }[];
}

export function GenrePieChart({ genres }: GenrePieChartProps) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genres}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            dataKey="count"
            nameKey="genre"
          >
            {genres.map((_, index) => (
              <Cell key={`cell-${index}`} fill={RESTRAINED_COLORS[index % RESTRAINED_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#101216", borderColor: "#292C33", borderRadius: "8px", color: "#F4F2ED" }}
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
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#202329" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#94959A" fontSize={11} />
          <YAxis stroke="#94959A" fontSize={11} />
          <Tooltip
            contentStyle={{ backgroundColor: "#101216", borderColor: "#292C33", borderRadius: "8px", color: "#F4F2ED" }}
          />
          <Line type="monotone" dataKey="recommendations_count" name="Rec Requests" stroke="#7E9BB7" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="ratings_count" name="Ratings" stroke="#D94B56" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
