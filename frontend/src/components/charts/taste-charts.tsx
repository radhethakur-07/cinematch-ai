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
import { useTheme } from "@/components/theme/theme-provider";

interface GenreRadarProps {
  affinities: GenreAffinity[];
}

export function GenreRadarChart({ affinities }: GenreRadarProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const data = affinities.map((a) => ({
    genre: a.genre_name,
    affinity: a.affinity_percentage,
  }));

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-60 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke={isDark ? "#202329" : "#E8E4DC"} />
          <PolarAngleAxis
            dataKey="genre"
            stroke={isDark ? "#94959A" : "#707277"}
            fontSize={11}
            tick={{ fill: isDark ? "#C1C0BC" : "#44464B" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke={isDark ? "#292C33" : "#DDD9D0"}
            fontSize={10}
          />
          <Radar
            name="Affinity %"
            dataKey="affinity"
            stroke={isDark ? "#D94B56" : "#C9434F"}
            fill={isDark ? "#D94B56" : "#C9434F"}
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
          <XAxis dataKey="name" stroke={isDark ? "#94959A" : "#707277"} fontSize={11} />
          <YAxis stroke={isDark ? "#94959A" : "#707277"} fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#101216" : "#FFFFFF",
              borderColor: isDark ? "#292C33" : "#DDD9D0",
              borderRadius: "8px",
              color: isDark ? "#F4F2ED" : "#17181B",
              boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(20,20,20,0.08)",
            }}
          />
          <Bar dataKey="count" fill={isDark ? "#D6B56D" : "#A77A32"} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GenrePieChartProps {
  genres: { genre: string; count: number; percentage: number }[];
}

export function GenrePieChart({ genres }: GenrePieChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = isDark
    ? ["#D94B56", "#D6B56D", "#7E9BB7", "#6FA884", "#B83B46", "#C1C0BC"]
    : ["#C9434F", "#A77A32", "#526D87", "#477A5A", "#9B3842", "#707277"];

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
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#101216" : "#FFFFFF",
              borderColor: isDark ? "#292C33" : "#DDD9D0",
              borderRadius: "8px",
              color: isDark ? "#F4F2ED" : "#17181B",
              boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(20,20,20,0.08)",
            }}
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke={isDark ? "#202329" : "#E8E4DC"} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={isDark ? "#94959A" : "#707277"} fontSize={11} />
          <YAxis stroke={isDark ? "#94959A" : "#707277"} fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#101216" : "#FFFFFF",
              borderColor: isDark ? "#292C33" : "#DDD9D0",
              borderRadius: "8px",
              color: isDark ? "#F4F2ED" : "#17181B",
              boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 4px 20px rgba(20,20,20,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="recommendations_count"
            name="Rec Requests"
            stroke={isDark ? "#7E9BB7" : "#526D87"}
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="ratings_count"
            name="Ratings"
            stroke={isDark ? "#D94B56" : "#C9434F"}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
