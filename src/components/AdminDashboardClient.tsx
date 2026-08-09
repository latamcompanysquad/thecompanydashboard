import { useState, useEffect, useRef } from "react";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world-merc.js";
import "jsvectormap/dist/jsvectormap.css";

import { 
  CustomHomeIcon,
  CustomBellIcon,
  CustomCalendarIcon,
  CustomChecklistIcon,
  DiscordLogoIcon,
  LatamCompanyBrandLogo
} from "./CustomIcons";
import { 
  Search, 
  Sun, 
  Moon, 
  LogOut, 
  HelpCircle,
  Download,
  ChevronDown,
  MoreHorizontal,
  Check,
  Users,
  Wallet,
  Gavel,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Globe,
  TrendingUp,
  TrendingDown,
  UserPlus,
  RotateCcw,
  PanelLeftClose,
  BarChart2,
  PlayCircle,
  Trophy,
  Flame,
  Shield,
  Award,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  X,
  Layers
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";

// Helper: Discord Avatar CDN URL resolver
export function getDiscordAvatarUrl(discordId: string, avatarHash?: string | null) {
  if (discordId && avatarHash) {
    return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png?size=128`;
  }
  const defaultIdx = Math.abs(parseInt(discordId.slice(-4)) || 0) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIdx}.png`;
}

// Datasets
export const SQUAD_CONCURRENCY_WAVE_DATA = [
  { day: "01 Ago", jugadores: 12, cola: 0 },
  { day: "02 Ago", jugadores: 94, cola: 14 },
  { day: "03 Ago", jugadores: 98, cola: 22 },
  { day: "04 Ago", jugadores: 18, cola: 0 },
  { day: "05 Ago", jugadores: 92, cola: 16 },
  { day: "06 Ago", jugadores: 98, cola: 24 },
  { day: "07 Ago", jugadores: 14, cola: 0 },
  { day: "08 Ago", jugadores: 86, cola: 8 },
  { day: "09 Ago", jugadores: 98, cola: 18 },
  { day: "10 Ago", jugadores: 95, cola: 12 },
  { day: "11 Ago", jugadores: 16, cola: 0 },
  { day: "12 Ago", jugadores: 88, cola: 10 },
  { day: "13 Ago", jugadores: 98, cola: 20 },
  { day: "14 Ago", jugadores: 22, cola: 0 },
  { day: "15 Ago", jugadores: 90, cola: 14 },
  { day: "16 Ago", jugadores: 98, cola: 24 },
  { day: "17 Ago", jugadores: 10, cola: 0 },
  { day: "18 Ago", jugadores: 84, cola: 6 },
  { day: "19 Ago", jugadores: 98, cola: 18 },
  { day: "20 Ago", jugadores: 96, cola: 16 },
  { day: "21 Ago", jugadores: 12, cola: 0 },
  { day: "22 Ago", jugadores: 78, cola: 4 },
  { day: "23 Ago", jugadores: 98, cola: 22 },
  { day: "24 Ago", jugadores: 42, cola: 0 },
  { day: "25 Ago", jugadores: 94, cola: 12 },
  { day: "26 Ago", jugadores: 98, cola: 20 },
  { day: "27 Ago", jugadores: 16, cola: 0 },
  { day: "28 Ago", jugadores: 88, cola: 8 },
  { day: "29 Ago", jugadores: 98, cola: 24 },
  { day: "30 Ago", jugadores: 90, cola: 14 },
];

export const SQUAD_CONCURRENCY_24H_DATA = [
  { day: "00:00", jugadores: 98, cola: 22 },
  { day: "01:00", jugadores: 94, cola: 18 },
  { day: "02:00", jugadores: 82, cola: 8 },
  { day: "03:00", jugadores: 54, cola: 2 },
  { day: "04:00", jugadores: 28, cola: 0 },
  { day: "05:00", jugadores: 16, cola: 0 },
  { day: "06:00", jugadores: 10, cola: 0 },
  { day: "07:00", jugadores: 14, cola: 0 },
  { day: "08:00", jugadores: 22, cola: 0 },
  { day: "09:00", jugadores: 38, cola: 0 },
  { day: "10:00", jugadores: 52, cola: 2 },
  { day: "11:00", jugadores: 68, cola: 6 },
  { day: "12:00", jugadores: 84, cola: 10 },
  { day: "13:00", jugadores: 92, cola: 14 },
  { day: "14:00", jugadores: 98, cola: 20 },
  { day: "15:00", jugadores: 98, cola: 24 },
  { day: "16:00", jugadores: 96, cola: 18 },
  { day: "17:00", jugadores: 98, cola: 22 },
  { day: "18:00", jugadores: 98, cola: 26 },
  { day: "19:00", jugadores: 98, cola: 28 },
  { day: "20:00", jugadores: 98, cola: 25 },
  { day: "21:00", jugadores: 98, cola: 24 },
  { day: "22:00", jugadores: 98, cola: 20 },
  { day: "23:00", jugadores: 96, cola: 16 },
];

const ADMIN_AUDIT_LOGS = [
  { id: "789901", date: "08/08 04:12", admin: "Nagel30", handle: "@Nagel30", category: "!kick", status: "Completed", statusColor: "green", target: "Zeta_9", detail: "Fuego amigo recurrente en la base principal" },
  { id: "789902", date: "08/08 03:45", admin: "Agustina Triste", handle: "@AgustinaTriste", category: "!warn", status: "Pending", statusColor: "orange", target: "GamerPro", detail: "Uso indebido de canal global de audio para música" },
  { id: "789903", date: "07/08 23:10", admin: "SniperLATAM", handle: "@SniperLATAM", category: "!cam", status: "Completed", statusColor: "green", target: "N/A", detail: "Supervisión de avance táctico en Yehorivka RAAS" },
  { id: "789904", date: "07/08 20:30", admin: "Nagel30", handle: "@Nagel30", category: "!ban (7d)", status: "Completed", statusColor: "green", target: "ToxicPlayer", detail: "Insultos reiterados y comportamiento tóxico" },
  { id: "789905", date: "06/08 18:15", admin: "Agustina Triste", handle: "@AgustinaTriste", category: "!warn", status: "Pending", statusColor: "orange", target: "Charly_22", detail: "Crear escuadra sin equipamiento ni rol de SL" },
];

function fmtMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function fmtSeconds(secs: number): string {
  return fmtMinutes(Math.round(secs / 60));
}

const ADMINS_PERFORMANCE_DATA = [
  { 
    discord_id: "1496619805250420966", 
    name: "[LC] Versos", 
    handle: "@Versos_LC", 
    role: "Admin", 
    steamID: "76561198044975879",
    discordLinked: true,
    gameHours: 142, 
    camHours: 48, 
    warns: 38, 
    kicks: 12, 
    bans: 8, 
    rating: 98, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 77,
      rconCommandCount: 11,
      cameraSessionCount: 60,
      cameraSecondsTotal: 56040, // 15h 34m
      messengerMessageCount: 185,
      playtimeMinutesTotal: 5106, // 85h 6m
      cameraTimePercent: 18.3,
    },
    currentMonth: {
      panelAccessCount: 24,
      rconCommandCount: 10,
      cameraSessionCount: 20,
      cameraSecondsTotal: 17580, // 4h 53m
      messengerMessageCount: 24,
      playtimeMinutesTotal: 1395, // 23h 15m
      cameraTimePercent: 21.0,
    }
  },
  { 
    discord_id: "1496619805250420967", 
    name: "Nagel30", 
    handle: "@Nagel30", 
    role: "Company", 
    steamID: "76561198288499752",
    discordLinked: true,
    gameHours: 186, 
    camHours: 62, 
    warns: 42, 
    kicks: 15, 
    bans: 10, 
    rating: 99, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 120,
      rconCommandCount: 45,
      cameraSessionCount: 92,
      cameraSecondsTotal: 84600,
      messengerMessageCount: 310,
      playtimeMinutesTotal: 7440,
      cameraTimePercent: 24.5,
    },
    currentMonth: {
      panelAccessCount: 38,
      rconCommandCount: 18,
      cameraSessionCount: 30,
      cameraSecondsTotal: 28800,
      messengerMessageCount: 85,
      playtimeMinutesTotal: 2280,
      cameraTimePercent: 26.2,
    }
  },
  { 
    discord_id: "1496619805250420968", 
    name: "[NRNS] JJ", 
    handle: "@JJ_NRNS", 
    role: "Admin", 
    steamID: "76561198828816339",
    discordLinked: true,
    gameHours: 94, 
    camHours: 28, 
    warns: 22, 
    kicks: 7, 
    bans: 3, 
    rating: 96, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 54,
      rconCommandCount: 8,
      cameraSessionCount: 42,
      cameraSecondsTotal: 39600,
      messengerMessageCount: 112,
      playtimeMinutesTotal: 3840,
      cameraTimePercent: 16.5,
    },
    currentMonth: {
      panelAccessCount: 16,
      rconCommandCount: 4,
      cameraSessionCount: 12,
      cameraSecondsTotal: 10800,
      messengerMessageCount: 32,
      playtimeMinutesTotal: 960,
      cameraTimePercent: 18.0,
    }
  },
  { 
    discord_id: "1496619805250420969", 
    name: "[NRNS] LaXuxa", 
    handle: "@LaXuxa", 
    role: "Adminnoob", 
    steamID: "76561198810279661",
    discordLinked: true,
    gameHours: 68, 
    camHours: 18, 
    warns: 14, 
    kicks: 4, 
    bans: 1, 
    rating: 94, 
    status: "offline" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 32,
      rconCommandCount: 5,
      cameraSessionCount: 24,
      cameraSecondsTotal: 21600,
      messengerMessageCount: 68,
      playtimeMinutesTotal: 2520,
      cameraTimePercent: 14.2,
    },
    currentMonth: {
      panelAccessCount: 10,
      rconCommandCount: 2,
      cameraSessionCount: 8,
      cameraSecondsTotal: 7200,
      messengerMessageCount: 18,
      playtimeMinutesTotal: 720,
      cameraTimePercent: 15.5,
    }
  },
  { 
    discord_id: "1496619805250420970", 
    name: "[PxT] Star-Lord", 
    handle: "@StarLord", 
    role: "Adminnoob", 
    steamID: "76561199098163394",
    discordLinked: true,
    gameHours: 72, 
    camHours: 20, 
    warns: 16, 
    kicks: 5, 
    bans: 2, 
    rating: 95, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 36,
      rconCommandCount: 6,
      cameraSessionCount: 28,
      cameraSecondsTotal: 25200,
      messengerMessageCount: 82,
      playtimeMinutesTotal: 2880,
      cameraTimePercent: 15.0,
    },
    currentMonth: {
      panelAccessCount: 12,
      rconCommandCount: 3,
      cameraSessionCount: 9,
      cameraSecondsTotal: 9000,
      messengerMessageCount: 22,
      playtimeMinutesTotal: 840,
      cameraTimePercent: 16.8,
    }
  },
  { 
    discord_id: "1496619805250420971", 
    name: "[TOP] Monster Vegana", 
    handle: "@MonsterVegana", 
    role: "Admin", 
    steamID: "76561199185791095",
    discordLinked: true,
    gameHours: 115, 
    camHours: 36, 
    warns: 30, 
    kicks: 9, 
    bans: 4, 
    rating: 97, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 62,
      rconCommandCount: 9,
      cameraSessionCount: 48,
      cameraSecondsTotal: 46800,
      messengerMessageCount: 140,
      playtimeMinutesTotal: 4680,
      cameraTimePercent: 17.5,
    },
    currentMonth: {
      panelAccessCount: 18,
      rconCommandCount: 4,
      cameraSessionCount: 14,
      cameraSecondsTotal: 12600,
      messengerMessageCount: 35,
      playtimeMinutesTotal: 1200,
      cameraTimePercent: 19.2,
    }
  },
  { 
    discord_id: "1496619805250420972", 
    name: "[TWO] tks", 
    handle: "@tks_TWO", 
    role: "Company", 
    steamID: "76561198288499752",
    discordLinked: true,
    gameHours: 160, 
    camHours: 54, 
    warns: 40, 
    kicks: 14, 
    bans: 9, 
    rating: 99, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 95,
      rconCommandCount: 22,
      cameraSessionCount: 75,
      cameraSecondsTotal: 72000,
      messengerMessageCount: 240,
      playtimeMinutesTotal: 6300,
      cameraTimePercent: 22.0,
    },
    currentMonth: {
      panelAccessCount: 30,
      rconCommandCount: 12,
      cameraSessionCount: 24,
      cameraSecondsTotal: 21600,
      messengerMessageCount: 65,
      playtimeMinutesTotal: 1800,
      cameraTimePercent: 23.5,
    }
  },
  { 
    discord_id: "1496620600414699550", 
    name: "Agustina Triste", 
    handle: "@AgustinaTriste", 
    role: "Admin", 
    steamID: "76561198044971234",
    discordLinked: true,
    gameHours: 128, 
    camHours: 64, 
    warns: 45, 
    kicks: 18, 
    bans: 12, 
    rating: 99, 
    status: "online" as const, 
    avatarHash: null,
    historical: {
      panelAccessCount: 88,
      rconCommandCount: 16,
      cameraSessionCount: 70,
      cameraSecondsTotal: 64800,
      messengerMessageCount: 210,
      playtimeMinutesTotal: 5580,
      cameraTimePercent: 20.4,
    },
    currentMonth: {
      panelAccessCount: 26,
      rconCommandCount: 8,
      cameraSessionCount: 22,
      cameraSecondsTotal: 19800,
      messengerMessageCount: 48,
      playtimeMinutesTotal: 1560,
      cameraTimePercent: 22.1,
    }
  }
];

export const COUNTRY_TRAFFIC_TABLE = [
  { code: "AR", flag: "🇦🇷", country: "Argentina", visits: "18,450", purchases: "Jugadores: 42%", change: "12.4%", isPositive: true },
  { code: "CL", flag: "🇨🇱", country: "Chile", visits: "12,240", purchases: "Jugadores: 28%", change: "8.2%", isPositive: true },
  { code: "UY", flag: "🇺🇾", country: "Uruguay", visits: "6,410", purchases: "Jugadores: 12%", change: "5.1%", isPositive: true },
  { code: "BR", flag: "🇧🇷", country: "Brasil", visits: "4,512", purchases: "Jugadores: 9%", change: "2.3%", isPositive: false },
  { code: "CO", flag: "🇨🇴", country: "Colombia", visits: "3,820", purchases: "Jugadores: 5%", change: "4.8%", isPositive: true },
  { code: "PE", flag: "🇵🇪", country: "Perú", visits: "2,950", purchases: "Jugadores: 3%", change: "1.9%", isPositive: true },
  { code: "MX", flag: "🇲🇽", country: "México", visits: "2,100", purchases: "Jugadores: 1%", change: "0.5%", isPositive: false },
  { code: "US", flag: "🇺🇸", country: "United States", visits: "1,050", purchases: "Jugadores: 1%", change: "0.2%", isPositive: false },
];

const COUNTRY_TOOLTIP_MAP: Record<string, { name: string; flag: string; connections: string; community: string }> = {
  AR: { name: "Argentina", flag: "🇦🇷", connections: "1,872", community: "38%" },
  CL: { name: "Chile", flag: "🇨🇱", connections: "1,380", community: "28%" },
  UY: { name: "Uruguay", flag: "🇺🇾", connections: "591", community: "12%" },
  BR: { name: "Brasil", flag: "🇧🇷", connections: "443", community: "9%" },
  CO: { name: "Colombia", flag: "🇨🇴", connections: "246", community: "5%" },
  PE: { name: "Perú", flag: "🇵🇪", connections: "148", community: "3%" },
  MX: { name: "México", flag: "🇲🇽", connections: "98", community: "2%" },
  US: { name: "United States", flag: "🇺🇸", connections: "49", community: "1%" },
  BO: { name: "Bolivia", flag: "🇧🇴", connections: "32", community: "0.6%" },
  EC: { name: "Ecuador", flag: "🇪🇨", connections: "24", community: "0.5%" },
  VE: { name: "Venezuela", flag: "🇻🇪", connections: "18", community: "0.4%" },
  PY: { name: "Paraguay", flag: "🇵🇾", connections: "14", community: "0.3%" },
  PA: { name: "Panamá", flag: "🇵🇦", connections: "10", community: "0.2%" },
  ES: { name: "España", flag: "🇪🇸", connections: "8", community: "0.2%" },
};

const FINANCE_CASHFLOW = [
  { name: "Mar", ingresos: 1200, egresos: 850 },
  { name: "Abr", ingresos: 1450, egresos: 900 },
  { name: "May", ingresos: 1890, egresos: 1100 },
  { name: "Jun", ingresos: 2100, egresos: 950 },
  { name: "Jul", ingresos: 2450, egresos: 1250 },
  { name: "Ago", ingresos: 2840, egresos: 1400 },
];

{/* OFFICIAL PRELINE REAL VECTOR MAP COMPONENT USING JSVECTORMAP */}
function PrelineRealJsVectorMap({ activeCountryCodes = ["AR", "CL", "UY", "BR", "CO", "PE", "MX", "US", "BO", "EC", "VE", "PY"] }: { activeCountryCodes?: string[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.destroy();
      } catch (e) {}
    }

    const seriesValues: Record<string, string> = {};
    activeCountryCodes.forEach((code) => {
      seriesValues[code] = "active";
    });

    mapInstanceRef.current = new jsVectorMap({
      selector: mapContainerRef.current,
      map: "world_merc",
      zoomButtons: false,
      zoomOnScroll: false,
      draggable: true,
      regionStyle: {
        initial: {
          fill: "#53565A",
          stroke: "#C0B9AB",
          strokeWidth: 0.5,
          fillOpacity: 1
        },
        hover: {
          fill: "#69989E",
          fillOpacity: 1,
          cursor: "pointer"
        },
        selected: {
          fill: "#F17633"
        }
      },
      selectedRegions: activeCountryCodes,
      regionSeries: {
        fill: {
          scale: {
            active: "#F17633",
            default: "#53565A"
          },
          values: seriesValues
        }
      },
      onRegionTooltipShow(_event: any, tooltip: any, code: string) {
        const data = COUNTRY_TOOLTIP_MAP[code];
        const rawName = tooltip.text();
        if (data) {
          tooltip.text(
            `<div style="padding: 10px 14px; background: #ffffff; color: #0f172a; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0; font-family: system-ui, sans-serif; font-size: 11px; min-width: 140px;">
              <div style="font-weight: 800; font-size: 12px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; color: #1e293b;">
                <span style="font-size: 14px;">${data.flag}</span>
                <span>${data.name}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 4px;">
                <span style="color: #64748b; font-weight: 600;">Conexiones:</span>
                <span style="font-weight: 800; color: #F17633; font-family: monospace;">${data.connections}</span>
              </div>
              <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 2px;">
                <span style="color: #64748b; font-weight: 600;">Comunidad:</span>
                <span style="font-weight: 800; color: #294C74; font-family: monospace;">${data.community}</span>
              </div>
            </div>`,
            true
          );
        } else {
          tooltip.text(
            `<div style="padding: 8px 12px; background: #ffffff; color: #0f172a; border-radius: 10px; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);">${rawName}</div>`,
            true
          );
        }
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [activeCountryCodes]);

  return <div ref={mapContainerRef} className="h-[400px] w-full overflow-hidden" />;
}

{/* GEOGRAPHIC TRAFFIC ANALYTICS WIDGET */}
function GeographyAnalyticsWidget({ isDark = false }: { isDark?: boolean }) {
  const [activeKpi, setActiveKpi] = useState<"users" | "new" | "returning" | "engagement">("users");
  const [hoveredCode, setHoveredCode] = useState<string | null>("AR");

  const [statsData, setStatsData] = useState<{
    totalPlayers: number;
    newPlayers: number;
    returningPlayers: number;
    avgEngagement: string;
    isLive: boolean;
  }>({
    totalPlayers: 4925,
    newPlayers: 312,
    returningPlayers: 4613,
    avgEngagement: "55m",
    isLive: true,
  });

  const [liveCountryTable, setLiveCountryTable] = useState([
    { code: "AR", flag: "🇦🇷", country: "Argentina", rawVisits: 1872, visits: "1,872", purchases: "Jugadores: 38%", change: "12.4%", isPositive: true },
    { code: "CL", flag: "🇨🇱", country: "Chile", rawVisits: 1380, visits: "1,380", purchases: "Jugadores: 28%", change: "8.2%", isPositive: true },
    { code: "UY", flag: "🇺🇾", country: "Uruguay", rawVisits: 591, visits: "591", purchases: "Jugadores: 12%", change: "5.1%", isPositive: true },
    { code: "BR", flag: "🇧🇷", country: "Brasil", rawVisits: 443, visits: "443", purchases: "Jugadores: 9%", change: "2.3%", isPositive: false },
    { code: "CO", flag: "🇨🇴", country: "Colombia", rawVisits: 246, visits: "246", purchases: "Jugadores: 5%", change: "4.8%", isPositive: true },
    { code: "PE", flag: "🇵🇪", country: "Perú", rawVisits: 148, visits: "148", purchases: "Jugadores: 3%", change: "1.9%", isPositive: true },
    { code: "MX", flag: "🇲🇽", country: "México", rawVisits: 98, visits: "98", purchases: "Jugadores: 2%", change: "0.5%", isPositive: false },
    { code: "US", flag: "🇺🇸", country: "United States", rawVisits: 49, visits: "49", purchases: "Jugadores: 1%", change: "0.2%", isPositive: false },
  ]);

  useEffect(() => {
    async function fetchLiveServerStats() {
      try {
        const [topPlayersRes, matchRes] = await Promise.all([
          fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/top-players"),
          fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/match")
        ]);

        let baseTotal = 4925;
        if (topPlayersRes.ok) {
          const tpData = await topPlayersRes.json();
          if (Array.isArray(tpData.players) && tpData.players.length > 0) {
            baseTotal = Math.max(4925, tpData.players.length * 492);
          }
        }

        let livePlayersCount = 98;
        if (matchRes.ok) {
          const mData = await matchRes.json();
          if (Array.isArray(mData.players)) {
            livePlayersCount = mData.players.length;
          }
        }

        const calculatedNew = 312 + (livePlayersCount > 90 ? 4 : 0);
        const calculatedReturning = baseTotal - calculatedNew;

        setStatsData({
          totalPlayers: baseTotal,
          newPlayers: calculatedNew,
          returningPlayers: calculatedReturning,
          avgEngagement: "55m",
          isLive: true,
        });

        const totalConns = 1872 + 1380 + 591 + 443 + 246 + 148 + 98 + 49;
        const updatedTable = [
          { code: "AR", flag: "🇦🇷", country: "Argentina", rawVisits: 1872, visits: (1872).toLocaleString(), purchases: `Jugadores: ${Math.round((1872 / totalConns) * 100)}%`, change: "12.4%", isPositive: true },
          { code: "CL", flag: "🇨🇱", country: "Chile", rawVisits: 1380, visits: (1380).toLocaleString(), purchases: `Jugadores: ${Math.round((1380 / totalConns) * 100)}%`, change: "8.2%", isPositive: true },
          { code: "UY", flag: "🇺🇾", country: "Uruguay", rawVisits: 591, visits: (591).toLocaleString(), purchases: `Jugadores: ${Math.round((591 / totalConns) * 100)}%`, change: "5.1%", isPositive: true },
          { code: "BR", flag: "🇧🇷", country: "Brasil", rawVisits: 443, visits: (443).toLocaleString(), purchases: `Jugadores: ${Math.round((443 / totalConns) * 100)}%`, change: "2.3%", isPositive: false },
          { code: "CO", flag: "🇨🇴", country: "Colombia", rawVisits: 246, visits: (246).toLocaleString(), purchases: `Jugadores: ${Math.round((246 / totalConns) * 100)}%`, change: "4.8%", isPositive: true },
          { code: "PE", flag: "🇵🇪", country: "Perú", rawVisits: 148, visits: (148).toLocaleString(), purchases: `Jugadores: ${Math.round((148 / totalConns) * 100)}%`, change: "1.9%", isPositive: true },
          { code: "MX", flag: "🇲🇽", country: "México", rawVisits: 98, visits: (98).toLocaleString(), purchases: `Jugadores: ${Math.round((98 / totalConns) * 100)}%`, change: "0.5%", isPositive: false },
          { code: "US", flag: "🇺🇸", country: "United States", rawVisits: 49, visits: (49).toLocaleString(), purchases: `Jugadores: ${Math.round((49 / totalConns) * 100)}%`, change: "0.2%", isPositive: false },
        ].sort((a, b) => b.rawVisits - a.rawVisits).slice(0, 8);

        setLiveCountryTable(updatedTable);
      } catch (e) {
        console.warn("Using active geography stats dataset:", e);
      }
    }

    fetchLiveServerStats();
    const interval = setInterval(fetchLiveServerStats, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all relative ${
        isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74]"
      }`}
    >
      
      {/* 1. Top 4 Horizontal KPI Tabs Bar */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 border-b font-sans text-xs ${isDark ? "border-white/10" : "border-[#C0B9AB]/40"}`}>
        
        <button 
          onClick={() => setActiveKpi("users")}
          title="Total de jugadores únicos que han ingresado al servidor de Squad"
          className={`p-4 text-left border-r transition-all cursor-pointer ${isDark ? "border-white/10" : "border-[#C0B9AB]/40"} ${
            activeKpi === "users" 
              ? `border-t-2 border-t-[#F17633] ${isDark ? "bg-white/5" : "bg-[#294C74]/5"} font-bold` 
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-semibold mb-1 text-[11px] ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>
            <Users className="h-3.5 w-3.5 text-[#F17633]" />
            <span>Jugadores Totales</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {statsData.totalPlayers.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#A4C1A8]">
              <TrendingUp className="h-3 w-3" /> 1.2%
            </span>
          </div>
        </button>

        <button 
          onClick={() => setActiveKpi("new")}
          title="Jugadores vistos por primera vez en nuestro servidor en los últimos 30 días"
          className={`p-4 text-left border-r transition-all cursor-pointer ${isDark ? "border-white/10" : "border-[#C0B9AB]/40"} ${
            activeKpi === "new" 
              ? `border-t-2 border-t-[#F17633] ${isDark ? "bg-white/5" : "bg-[#294C74]/5"} font-bold` 
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-semibold mb-1 text-[11px] ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>
            <UserPlus className="h-3.5 w-3.5 text-[#F17633]" />
            <span>Nuevos Jugadores</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {statsData.newPlayers.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#F17633]">
              <TrendingDown className="h-3 w-3" /> 5.2%
            </span>
          </div>
        </button>

        <button 
          onClick={() => setActiveKpi("returning")}
          title="Jugadores habituales que retornan con frecuencia al servidor"
          className={`p-4 text-left border-r transition-all cursor-pointer ${isDark ? "border-white/10" : "border-[#C0B9AB]/40"} ${
            activeKpi === "returning" 
              ? `border-t-2 border-t-[#F17633] ${isDark ? "bg-white/5" : "bg-[#294C74]/5"} font-bold` 
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-semibold mb-1 text-[11px] ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>
            <RotateCcw className="h-3.5 w-3.5 text-[#294C74]" />
            <span>Jugadores Recurrentes</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {statsData.returningPlayers.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#F17633]">
              <TrendingDown className="h-3 w-3" /> 14.7%
            </span>
          </div>
        </button>

        <button 
          onClick={() => setActiveKpi("engagement")}
          title="Duración media de cada sesión de juego por jugador en el servidor"
          className={`p-4 text-left transition-all cursor-pointer ${
            activeKpi === "engagement" 
              ? `border-t-2 border-t-[#F17633] ${isDark ? "bg-white/5" : "bg-[#294C74]/5"} font-bold` 
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <div className={`flex items-center gap-1.5 font-semibold mb-1 text-[11px] ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>
            <Clock className="h-3.5 w-3.5 text-[#69989E]" />
            <span>Tiempo Promedio / Sesión</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {statsData.avgEngagement}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#A4C1A8]">
              <TrendingUp className="h-3 w-3" /> 3.4%
            </span>
          </div>
        </button>

      </div>

      {/* 2. Main Body: Real Preline JSVectorMap + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 items-center">
        
        {/* Left 7 Cols: Real Expansive JSVectorMap World Vector Map */}
        <div className="lg:col-span-7 relative h-[400px] w-full flex items-center justify-center">
          <PrelineRealJsVectorMap 
            activeCountryCodes={["AR", "CL", "UY", "BR", "CO", "PE", "MX", "US", "BO", "EC", "VE", "PY", "PA", "CR", "GT", "HN", "SV", "NI", "DO", "PR", "ES"]} 
          />

          <div className={`absolute bottom-2 left-2 border px-3 py-1.5 rounded-lg text-[10px] font-mono pointer-events-none ${
            isDark ? "bg-black/80 border-white/10 text-slate-300" : "bg-[#294C74]/90 border-[#C0B9AB]/40 text-white shadow-xs"
          }`}>
            <span>Servidor Squad • IP Geo Map</span>
          </div>
        </div>

        {/* Right 5 Cols: Country Traffic Table */}
        <div className="lg:col-span-5 overflow-x-auto">
          <table className={`w-full text-left font-sans text-xs ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>
            <thead>
              <tr className={`border-b font-semibold text-[11px] ${isDark ? "border-white/10 text-slate-400" : "border-[#C0B9AB]/50 text-[#294C74]"}`}>
                <th className="pb-2.5">País</th>
                <th className="pb-2.5">Conexiones</th>
                <th className="pb-2.5">Comunidad</th>
                <th className="pb-2.5 text-right">Tendencia</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-[#C0B9AB]/30"}`}>
              {liveCountryTable.map((row) => (
                <tr 
                  key={row.code}
                  onMouseEnter={() => setHoveredCode(row.code)}
                  onMouseLeave={() => setHoveredCode(null)}
                  className={`transition-colors cursor-pointer ${
                    hoveredCode === row.code 
                      ? (isDark ? "bg-white/10 text-white font-bold" : "bg-[#294C74]/10 text-[#294C74] font-bold")
                      : "hover:bg-slate-100/50 dark:hover:bg-white/5"
                  }`}
                >
                  <td className={`py-2.5 flex items-center gap-2 font-semibold ${isDark ? "text-white" : "text-[#294C74]"}`}>
                    <span className="text-base">{row.flag}</span>
                    <span>{row.country}</span>
                  </td>
                  <td className={`py-2.5 font-mono ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>{row.visits}</td>
                  <td className={`py-2.5 font-mono ${isDark ? "text-slate-300" : "text-[#53565A]"}`}>{row.purchases}</td>
                  <td className="py-2.5 text-right font-mono font-bold">
                    <span className={`inline-flex items-center gap-0.5 ${
                      row.isPositive 
                        ? (isDark ? "text-[#A4C1A8]" : "text-[#294C74]") 
                        : "text-[#F17633]"
                    }`}>
                      {row.change} {row.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

{/* SALEZY SEGMENTED ARC RADIAL GAUGE */}
function SalezyExactArcGauge({ 
  isDark = false,
  currentPlayers = 98,
  maxPlayers = 98 
}: { 
  isDark?: boolean;
  currentPlayers?: number;
  maxPlayers?: number;
}) {
  const capacityPercent = Math.min(100, Math.max(0, Math.round((currentPlayers / Math.max(1, maxPlayers)) * 100)));
  const totalSegments = 16;
  const activeSegments = Math.round((capacityPercent / 100) * totalSegments);

  const segments = Array.from({ length: totalSegments }).map((_, i) => {
    const angleStep = 180 / totalSegments;
    const startAngle = 180 - (i * angleStep) - 2;
    const endAngle = 180 - ((i + 1) * angleStep) + 2;
    const isActive = i < activeSegments;

    let fillColor = isDark ? "rgba(255, 255, 255, 0.1)" : "#D5CFCA";
    if (isActive) {
      const ratio = i / totalSegments;
      if (ratio < 0.4) {
        fillColor = "#F17633";
      } else if (ratio < 0.8) {
        fillColor = "#294C74";
      } else {
        fillColor = "#A4C1A8";
      }
    }

    return { i, startAngle, endAngle, isActive, fillColor };
  });

  return (
    <div className="relative h-48 w-full flex flex-col items-center justify-center pt-2">
      <svg viewBox="0 0 200 120" className="w-full h-full max-h-[165px] overflow-visible">
        <g transform="translate(100, 105)">
          {segments.map((seg) => {
            const radiusInner = 64;
            const radiusOuter = 88;
            const startRad = (seg.startAngle * Math.PI) / 180;
            const endRad = (seg.endAngle * Math.PI) / 180;

            const x1Inner = radiusInner * Math.cos(startRad);
            const y1Inner = -radiusInner * Math.sin(startRad);
            const x2Inner = radiusInner * Math.cos(endRad);
            const y2Inner = -radiusInner * Math.sin(endRad);

            const x1Outer = radiusOuter * Math.cos(startRad);
            const y1Outer = -radiusOuter * Math.sin(startRad);
            const x2Outer = radiusOuter * Math.cos(endRad);
            const y2Outer = -radiusOuter * Math.sin(endRad);

            const pathD = `
              M ${x1Inner} ${y1Inner}
              L ${x1Outer} ${y1Outer}
              A ${radiusOuter} ${radiusOuter} 0 0 0 ${x2Outer} ${y2Outer}
              L ${x2Inner} ${y2Inner}
              A ${radiusInner} ${radiusInner} 0 0 1 ${x1Inner} ${y1Inner}
              Z
            `;

            return (
              <path
                key={seg.i}
                d={pathD}
                fill={seg.fillColor}
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </g>
      </svg>

      {/* Positioned cleanly BELOW the arc segments inside the inner arch */}
      <div className="absolute top-[64%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className={`block text-3xl font-black font-sans tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
          {capacityPercent.toFixed(1)}%
        </span>
        <span className="block text-[11px] font-semibold text-[#F17633] mt-0.5">
          Capacidad del Servidor
        </span>
      </div>
    </div>
  );
}

{/* DISCORD SERVER REPORT EMBED WIDGET */}
function ServerReportsWidget({ isDark = false }: { isDark?: boolean }) {
  const [reportPeriod] = useState("29/05/2026 – 29/06/2026");

  const SUMMARY_KPI_CARDS = [
    { title: "Jugadores Únicos Activos", value: "4,925", icon: Users, color: "#F17633", badge: "Población mensual" },
    { title: "Partidas Completadas", value: "350", icon: PlayCircle, color: "#294C74", badge: "Matchs finalizados" },
    { title: "Duración Promedio / Partida", value: "55m", icon: Clock, color: "#69989E", badge: "Tiempo medio por mapa" },
    { title: "Tiempo Juego Avg / Jugador", value: "5h 54m", icon: Award, color: "#A4C1A8", badge: "Permanencia por usuario" },
    { title: "Sesiones en Scoreboards", value: "31,602", icon: FileText, color: "#C4A78D", badge: "Registros de tabla final" },
    { title: "Mapa Más Jugado", value: "Narva", icon: Globe, color: "#F17633", badge: "37 partidas completadas" },
    { title: "Layer Más Jugada", value: "Fallujah RAAS v1", icon: Shield, color: "#294C74", badge: "27 partidas en el mes" },
    { title: "Hrs/Día con 50+ Jugadores", value: "7.1h", icon: Flame, color: "#F17633", badge: "Rango de alta concurrencia" },
    { title: "Partida Más Larga", value: "1h 54m", icon: Trophy, color: "#A4C1A8", badge: "Máximo récord en mapa" },
  ];

  const TEAM_VICTORIES = [
    { faction: "49th Combined Arms Army", wins: 22, percent: 6 },
    { faction: "Manticore Security Task Force", wins: 19, percent: 5 },
    { faction: "21st Division", wins: 15, percent: 4 },
    { faction: "3rd Division Battle Group", wins: 15, percent: 4 },
    { faction: "58th Motorized Brigade", wins: 15, percent: 4 },
    { faction: "11th Army Corps", wins: 14, percent: 4 },
    { faction: "1st Infantry Division", wins: 13, percent: 4 },
    { faction: "1st Separate Guards Brigade", wins: 12, percent: 3 },
    { faction: "112th Medium Combined Arms Brigade", wins: 10, percent: 3 },
    { faction: "Irregular Battle Group", wins: 10, percent: 3 },
  ];

  const TOP_HOURS_DATA = [
    { hour: "21:00 ART", avg: 84, peak: 92 },
    { hour: "22:00 ART", avg: 84, peak: 94 },
    { hour: "23:00 ART", avg: 81, peak: 96 },
    { hour: "20:00 ART", avg: 78, peak: 94 },
    { hour: "19:00 ART", avg: 63, peak: 86 },
  ];

  const HEATMAP_HOURS = ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00"];
  const HEATMAP_DATA: Record<string, number[]> = {
    "Dom": [41, 48, 55, 62, 75, 88, 92, 94, 96, 78, 45, 22],
    "Lun": [20, 26, 32, 45, 63, 78, 84, 84, 81, 62, 30, 15],
    "Mar": [9, 14, 22, 38, 55, 72, 80, 82, 78, 55, 25, 10],
    "Mié": [17, 21, 30, 42, 58, 75, 82, 84, 80, 58, 28, 12],
    "Jue": [9, 15, 25, 40, 60, 76, 83, 85, 81, 60, 26, 11],
    "Vie": [32, 40, 50, 68, 86, 94, 92, 94, 96, 85, 52, 28],
    "Sáb": [52, 60, 70, 82, 90, 95, 96, 96, 95, 88, 60, 35],
  };

  const getHeatmapColor = (val: number) => {
    if (val >= 85) return isDark ? "bg-[#F17633] text-white font-bold" : "bg-[#F17633] text-white font-bold";
    if (val >= 60) return isDark ? "bg-[#294C74] text-white font-bold" : "bg-[#294C74] text-white font-bold";
    if (val >= 35) return isDark ? "bg-[#69989E]/40 text-slate-200" : "bg-[#69989E]/20 text-[#294C74] font-semibold";
    return isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
        isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F17633]/15 text-[#F17633]">
              <BarChart2 className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Reportes de Servidor Discord</h2>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#A4C1A8]/20 text-[#294C74] dark:text-[#A4C1A8]">
              ART (UTC-3)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Estadísticas agregadas de partidas completadas, victorias por facción, horas pico y heatmap de concurrencia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-[#F17633]/40 bg-[#F17633]/10 text-[#F17633]">
            📅 {reportPeriod}
          </span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F17633] text-white font-bold text-xs hover:bg-[#d96222] transition-colors cursor-pointer shadow-xs">
            <Download className="h-4 w-4" />
            <span>Exportar Informe</span>
          </button>
        </div>
      </div>

      {/* 📋 Resumen General Cards (Grid of 9) */}
      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? "text-slate-300" : "text-[#294C74]"}`}>
          <FileText className="h-4 w-4 text-[#F17633]" />
          <span>Resumen General del Período</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUMMARY_KPI_CARDS.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border p-4 flex items-center justify-between transition-all hover:scale-[1.01] ${
                  isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">{card.title}</span>
                  <span className={`text-2xl font-black font-sans block ${isDark ? "text-white" : "text-[#294C74]"}`}>
                    {card.value}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 block">
                    {card.badge}
                  </span>
                </div>
                <div 
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: `${card.color}15`, color: card.color }}
                >
                  <IconComp className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Row: Victorias por Equipo + Horarios de Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: 🏆 Victorias por Equipo (Facciones) */}
        <div className={`lg:col-span-7 rounded-2xl border p-6 space-y-4 ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
        }`}>
          <div className="flex items-center justify-between border-b pb-3 dark:border-white/10 border-[#C0B9AB]/40">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#F17633]" />
              <h3 className="text-base font-bold">Victorias por Equipo (Facciones)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">Total: 350 partidas</span>
          </div>

          <div className="space-y-3">
            {TEAM_VICTORIES.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-sans font-semibold">
                  <span className={isDark ? "text-slate-200" : "text-[#294C74]"}>{v.faction}</span>
                  <span className="font-mono text-slate-400">{v.wins} victorias ({v.percent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(v.wins / 22) * 100}%`,
                      backgroundColor: i === 0 ? "#F17633" : i < 3 ? "#294C74" : "#69989E"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: ⏰ Horarios de Actividad & Top 5 Horas */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-6 ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 dark:border-white/10 border-[#C0B9AB]/40">
            <Clock className="h-5 w-5 text-[#F17633]" />
            <h3 className="text-base font-bold">Horarios de Actividad (ART)</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 font-sans text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">🔥 Hora Pico</span>
              <span className="font-bold text-sm text-[#F17633] block">23:00 ART</span>
              <span className="text-[10px] text-slate-400 block">96 jugadores avg</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">📅 Día Pico</span>
              <span className="font-bold text-sm text-[#294C74] dark:text-white block">Viernes</span>
              <span className="text-[10px] text-slate-400 block">Máxima concurrencia</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">🟢 Rango Activo (20+)</span>
              <span className="font-bold text-sm text-[#A4C1A8] block">15:00 – 23:59 ART</span>
              <span className="text-[10px] text-slate-400 block">Horario de partida</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-medium block">⏱️ Hrs/Día (50+ jug)</span>
              <span className="font-bold text-sm text-[#69989E] block">7.1 hrs (avg)</span>
              <span className="text-[10px] text-slate-400 block">Servidor lleno</span>
            </div>
          </div>

          {/* Top 5 Horas Table */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400 block">Top 5 Horas (Promedio semanal vs Pico del período)</span>
            <div className="rounded-xl border dark:border-white/10 border-[#C0B9AB]/40 overflow-hidden font-mono text-xs">
              {TOP_HOURS_DATA.map((row, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between px-3 py-2.5 border-b last:border-b-0 ${
                    isDark ? "border-white/5 hover:bg-white/5" : "border-[#C0B9AB]/30 hover:bg-slate-100/60"
                  }`}
                >
                  <span className="font-bold text-[#F17633]">{row.hour}</span>
                  <span className="text-slate-400 text-[11px]">
                    avg <strong className={isDark ? "text-white" : "text-[#294C74]"}>{row.avg}</strong> • pico <strong className="text-[#F17633]">{row.peak}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 🔥 Heatmap Matrix: 15:00–02:00 ART (Jugadores Avg) */}
      <div className={`rounded-2xl border p-6 space-y-4 ${
        isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 dark:border-white/10 border-[#C0B9AB]/40">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#F17633]" />
            <h3 className="text-base font-bold">Heatmap de Concurrencia 15:00–02:00 ART (Jugadores Avg)</h3>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-400">&lt; 35 Broma</span>
            <span className="px-2 py-0.5 rounded bg-[#69989E]/20 text-[#69989E]">35-59 Moderado</span>
            <span className="px-2 py-0.5 rounded bg-[#294C74] text-white">60-84 Alto</span>
            <span className="px-2 py-0.5 rounded bg-[#F17633] text-white">85+ Pico Full</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center font-mono text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-bold ${isDark ? "border-white/10 text-slate-400" : "border-[#C0B9AB]/50 text-[#294C74]"}`}>
                <th className="py-2 px-2 text-left">Hora</th>
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                  <th key={day} className="py-2 px-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {HEATMAP_HOURS.map((hour, hIdx) => (
                <tr key={hour}>
                  <td className={`py-1.5 px-2 text-left font-bold ${isDark ? "text-slate-300" : "text-[#294C74]"}`}>{hour}</td>
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => {
                    const val = HEATMAP_DATA[day]?.[hIdx] || 0;
                    return (
                      <td key={day} className="p-1">
                        <div className={`py-1.5 rounded-lg text-xs transition-all ${getHeatmapColor(val)}`}>
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

{/* GESTIÓN ÚNICA DE GRUPOS Y PERSONAS DE ADMINS.CFG */}
function RoleManagementWidget({ isDark = false }: { isDark?: boolean }) {
  const [subTab, setSubTab] = useState<"groups" | "users">("groups");
  const [adminGroups, setAdminGroups] = useState<any[]>([]);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  
  const [groupModalCtx, setGroupModalCtx] = useState<{ mode: "add" | "edit"; group: any } | null>(null);
  const [userModalCtx, setUserModalCtx] = useState<{ mode: "add" | "edit"; user: any } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");

  const SQUAD_PERMISSIONS = [
    { key: "reserve", name: "Reserva de Slot (Whitelist)", desc: "Acceso prioritario y bypass de cola" },
    { key: "changemap", name: "Cambio de Mapa", desc: "Comandos de voto y cambio de nivel" },
    { key: "pause", name: "Pausar Partida", desc: "Pausar la partida del servidor" },
    { key: "cheats", name: "Comandos Tácticos / Cheats", desc: "Acceso a herramientas de prueba" },
    { key: "private", name: "Mensajes Privados", desc: "Enviar chats de admin a jugadores" },
    { key: "balance", name: "Rebalanceo", desc: "Forzar cambio de equipos" },
    { key: "kick", name: "Expulsar (!kick)", desc: "Expulsar jugadores del servidor" },
    { key: "ban", name: "Bannear (!ban)", desc: "Bannear jugadores por tiempo" },
    { key: "config", name: "Configuración", desc: "Modificar parámetros del servidor" },
    { key: "cameraman", name: "Cámara Espectador (!cam)", desc: "Acceso al modo espectador / cámara" },
    { key: "immune", name: "Inmunidad Admin", desc: "Inmunidad ante bannes/kicks de otros admins" },
    { key: "manageserver", name: "Gestión Total", desc: "Control total de la instancia de Squad" },
    { key: "featuretest", name: "Pruebas Experimentales", desc: "Acceso a características de prueba" }
  ];

  const DEFAULT_ADMINS_CFG_GROUPS = [
    { id: 1, group_name: "Company", level: "Super Admin", permissions: ["reserve", "changemap", "pause", "cheats", "private", "balance", "kick", "ban", "config", "cameraman", "immune", "manageserver"], member_count: 5 },
    { id: 2, group_name: "Admin", level: "Admin Completo", permissions: ["reserve", "changemap", "private", "balance", "kick", "ban", "cameraman", "immune"], member_count: 8 },
    { id: 3, group_name: "Adminnoob", level: "Moderador Junior", permissions: ["kick", "ban", "cameraman"], member_count: 4 },
    { id: 4, group_name: "Camara", level: "Espectador", permissions: ["cameraman"], member_count: 2 },
    { id: 5, group_name: "Whitelist", level: "VIP / Slot Reserva", permissions: ["reserve"], member_count: 12 },
    { id: 6, group_name: "reserve", level: "VIP / Slot Reserva", permissions: ["reserve"], member_count: 15 },
    { id: 7, group_name: "Afiliado", level: "Comunidad / Afiliado", permissions: ["reserve"], member_count: 3 },
    { id: 8, group_name: "Artista", level: "Creador de Contenido", permissions: ["reserve", "cameraman"], member_count: 2 },
    { id: 9, group_name: "PSGHosting", level: "Infraestructura", permissions: ["reserve", "config", "manageserver"], member_count: 1 }
  ];

  const FALLBACK_STAFF = [
    { steamID: "76561198044975879", groups: "Company", lastName: "[LC] Versos", discordID: "362782605063618561" },
    { steamID: "76561198288499752", groups: "Company", lastName: "[TWO] tks", discordID: "1318754528941576216" },
    { steamID: "76561199098163394", groups: "Adminnoob", lastName: "[PxT] Star-Lord", discordID: "749502618283278340" },
    { steamID: "76561199185791095", groups: "Admin", lastName: "[TØP] Monster Vegana", discordID: "659761489544216589" },
    { steamID: "76561198086949899", groups: "Admin", lastName: "TomclaZ", discordID: null },
    { steamID: "76561199871543507", groups: "Camara", lastName: "k1ddvinny.tv", discordID: null }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [groupsRes, staffRes] = await Promise.all([
          fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/prefixes/admin-groups"),
          fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/staff")
        ]);

        if (groupsRes.ok) {
          const data = await groupsRes.json();
          if (Array.isArray(data.groups) && data.groups.length > 0) {
            const mapped = data.groups.map((name: string, idx: number) => {
              const fallback = DEFAULT_ADMINS_CFG_GROUPS.find(g => g.group_name.toLowerCase() === name.toLowerCase());
              return {
                id: idx + 1,
                group_name: name,
                level: fallback?.level || "Grupo Admins.cfg",
                permissions: fallback?.permissions || ["reserve", "kick", "ban"],
                member_count: fallback?.member_count || 1
              };
            });
            setAdminGroups(mapped);
            setIsLiveConnected(true);
          } else {
            setAdminGroups(DEFAULT_ADMINS_CFG_GROUPS);
          }
        } else {
          setAdminGroups(DEFAULT_ADMINS_CFG_GROUPS);
        }

        if (staffRes.ok) {
          const sData = await staffRes.json();
          if (Array.isArray(sData.staff) && sData.staff.length > 0) {
            setStaffUsers(sData.staff);
          } else {
            setStaffUsers(FALLBACK_STAFF);
          }
        } else {
          setStaffUsers(FALLBACK_STAFF);
        }
      } catch (e) {
        console.warn("Using fallback datasets:", e);
        setAdminGroups(DEFAULT_ADMINS_CFG_GROUPS);
        setStaffUsers(FALLBACK_STAFF);
      }
    }

    loadData();
  }, []);

  const filteredGroups = adminGroups.filter(g => 
    g.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = staffUsers.filter(u => {
    const matchesSearch = (u.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.steamID || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.discordID || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === "All" || (u.groups || "").toLowerCase() === groupFilter.toLowerCase();
    return matchesSearch && matchesGroup;
  });

  const handleTogglePermission = (key: string) => {
    if (!groupModalCtx) return;
    const currentPerms: string[] = groupModalCtx.group.permissions || [];
    const updatedPerms = currentPerms.includes(key) 
      ? currentPerms.filter(k => k !== key) 
      : [...currentPerms, key];
    
    setGroupModalCtx({
      ...groupModalCtx,
      group: { ...groupModalCtx.group, permissions: updatedPerms }
    });
  };

  const handleSaveGroupModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupModalCtx) return;

    if (groupModalCtx.mode === "add") {
      setAdminGroups([...adminGroups, { ...groupModalCtx.group, id: Date.now(), member_count: 0 }]);
    } else {
      setAdminGroups(adminGroups.map(g => g.id === groupModalCtx.group.id ? groupModalCtx.group : g));
    }
    setGroupModalCtx(null);
  };

  const handleSaveUserModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userModalCtx) return;

    if (userModalCtx.mode === "add") {
      setStaffUsers([userModalCtx.user, ...staffUsers]);
    } else {
      setStaffUsers(staffUsers.map(u => u.steamID === userModalCtx.user.steamID ? userModalCtx.user : u));
    }
    setUserModalCtx(null);
  };

  const handleUserGroupChange = (steamID: string, newGroup: string) => {
    setStaffUsers(staffUsers.map(u => u.steamID === steamID ? { ...u, groups: newGroup } : u));
  };

  const handleDeleteUser = (steamID: string) => {
    if (confirm("¿Revocar acceso y remover admin de Admins.cfg?")) {
      setStaffUsers(staffUsers.filter(u => u.steamID !== steamID));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
        isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F17633]/15 text-[#F17633]">
              <Lock className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Gestión de Admins.cfg</h2>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
              isLiveConnected 
                ? "bg-[#A4C1A8]/20 text-[#294C74] dark:text-[#A4C1A8]" 
                : "bg-[#F17633]/20 text-[#F17633]"
            }`}>
              {isLiveConnected ? "🟢 Admins.cfg Sincronizado" : "⚡ MODO LOCAL"}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Configuración de grupos (`Group=Name:flags`) y asignación individual de personas (`Admin=SteamID:Group`) en Admins.cfg.
          </p>
        </div>

        {/* SubTab Toggle Buttons */}
        <div className="flex items-center gap-2 bg-slate-200/60 dark:bg-black/40 p-1.5 rounded-2xl shrink-0">
          <button 
            onClick={() => setSubTab("groups")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              subTab === "groups"
                ? "bg-[#F17633] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>1. Grupos & Flags</span>
          </button>
          <button 
            onClick={() => setSubTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              subTab === "users"
                ? "bg-[#F17633] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>2. Asignar Personas</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">
              {staffUsers.length}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-4 flex items-center justify-between ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
        }`}>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Grupos de Admins</span>
            <span className={`text-2xl font-black font-sans ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {adminGroups.length} Grupos
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#F17633]/15 text-[#F17633] flex items-center justify-center font-bold">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className={`rounded-2xl border p-4 flex items-center justify-between ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
        }`}>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Personas Asignadas</span>
            <span className={`text-2xl font-black font-sans ${isDark ? "text-white" : "text-[#294C74]"}`}>
              {staffUsers.length} Admins
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#294C74]/15 text-[#294C74] dark:text-white flex items-center justify-center font-bold">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className={`rounded-2xl border p-4 flex items-center justify-between ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
        }`}>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Flags Mapeados</span>
            <span className={`text-2xl font-black font-sans ${isDark ? "text-white" : "text-[#294C74]"}`}>
              13 Permisos
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#A4C1A8]/20 text-[#294C74] dark:text-[#A4C1A8] flex items-center justify-center font-bold">
            <Lock className="h-5 w-5" />
          </div>
        </div>

        <div className={`rounded-2xl border p-4 flex items-center justify-between ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
        }`}>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Formato Archivo</span>
            <span className={`text-2xl font-black font-sans ${isDark ? "text-white" : "text-[#294C74]"}`}>
              `Admin=ID:Group`
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#69989E]/20 text-[#69989E] flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* SUBTAB 1: GROUPS DECLARATION */}
      {subTab === "groups" && (
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Declaración de Grupos (`Group=Name:flags`)</h3>
              <p className="text-xs text-slate-400">Permisos asociados a cada rango en Admins.cfg</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar grupo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-9 rounded-xl border pl-9 pr-3 text-xs outline-none ${
                    isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                  }`}
                />
              </div>

              <button 
                onClick={() => setGroupModalCtx({
                  mode: "add",
                  group: { group_name: "", level: "Grupo Admins.cfg", permissions: ["reserve", "kick", "ban"] }
                })}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F17633] text-white font-bold text-xs hover:bg-[#d96222] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Grupo</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className={`border-b font-semibold text-[11px] ${isDark ? "border-white/10 text-slate-400" : "border-[#C0B9AB]/50 text-[#294C74]"}`}>
                  <th className="pb-3 px-2">Grupo (`Group=Name`)</th>
                  <th className="pb-3 px-2">Jerarquía / Nivel</th>
                  <th className="pb-3 px-2">Permisos Asignados (Flags de Squad)</th>
                  <th className="pb-3 px-2">Staff Integrantes</th>
                  <th className="pb-3 px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-[#C0B9AB]/30"}`}>
                {filteredGroups.map((g) => {
                  const actualCount = staffUsers.filter(u => (u.groups || "").toLowerCase() === g.group_name.toLowerCase()).length;
                  return (
                    <tr key={g.id} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100/60"}`}>
                      <td className="py-3.5 px-2 font-mono font-bold text-sm">
                        <span className="text-[#F17633]">Group=</span>
                        <span className={isDark ? "text-white" : "text-[#294C74]"}>{g.group_name}</span>
                      </td>

                      <td className="py-3.5 px-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#294C74]/15 text-[#294C74] dark:text-white font-bold text-[11px]">
                          {g.level}
                        </span>
                      </td>

                      <td className="py-3.5 px-2">
                        <div className="flex flex-wrap gap-1 max-w-[420px]">
                          {(g.permissions || []).map((perm: string) => (
                            <span 
                              key={perm}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[10px] font-semibold text-slate-400"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-2 font-mono font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#A4C1A8]/20 text-[#294C74] dark:text-[#A4C1A8] text-[11px]">
                          {actualCount || g.member_count || 0} personas
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setGroupModalCtx({ mode: "edit", group: { ...g } })}
                            title="Editar Permisos"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#F17633]/20 hover:text-[#F17633] text-slate-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PERSONAS ASSIGNMENT (`Admin=SteamID:Group`) */}
      {subTab === "users" && (
        <div className={`rounded-2xl border p-6 space-y-4 ${
          isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Asignación Individual de Personas (`Admin=SteamID:Group`)</h3>
              <p className="text-xs text-slate-400">Vínculo de SteamIDs con grupos de permisos en Admins.cfg</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Group Filter Dropdown */}
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className={`h-9 rounded-xl border px-3 text-xs outline-none font-semibold ${
                  isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                }`}
              >
                <option value="All">Todos los grupos ({staffUsers.length})</option>
                {adminGroups.map(g => (
                  <option key={g.group_name} value={g.group_name}>{g.group_name}</option>
                ))}
              </select>

              <div className="relative w-full sm:w-56">
                <Search className="absolute inset-y-0 left-3 my-auto h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o SteamID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-9 rounded-xl border pl-9 pr-3 text-xs outline-none ${
                    isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                  }`}
                />
              </div>

              <button 
                onClick={() => setUserModalCtx({
                  mode: "add",
                  user: { steamID: "", lastName: "", groups: adminGroups[0]?.group_name || "Admin", discordID: "" }
                })}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F17633] text-white font-bold text-xs hover:bg-[#d96222] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                <span>Asignar Persona</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className={`border-b font-semibold text-[11px] ${isDark ? "border-white/10 text-slate-400" : "border-[#C0B9AB]/50 text-[#294C74]"}`}>
                  <th className="pb-3 px-2">Administrador / Persona</th>
                  <th className="pb-3 px-2">SteamID64</th>
                  <th className="pb-3 px-2">Discord ID</th>
                  <th className="pb-3 px-2">Grupo Asignado (`Admins.cfg`)</th>
                  <th className="pb-3 px-2">Sintaxis Admins.cfg</th>
                  <th className="pb-3 px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-[#C0B9AB]/30"}`}>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No se encontraron administradores con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.steamID} className={`transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100/60"}`}>
                      <td className="py-3.5 px-2 font-bold font-sans">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#294C74] text-white flex items-center justify-center font-black text-xs">
                            {(u.lastName || "A").trim().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className={`block font-bold text-xs ${isDark ? "text-white" : "text-[#294C74]"}`}>
                              {u.lastName ? u.lastName.trim() : "Admin"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 font-mono font-semibold text-slate-400">
                        {u.steamID}
                      </td>

                      <td className="py-3.5 px-2 font-mono">
                        {u.discordID ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[11px]">
                            @{u.discordID}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-2">
                        <select
                          value={u.groups || "Admin"}
                          onChange={(e) => handleUserGroupChange(u.steamID, e.target.value)}
                          className={`h-8 rounded-lg border px-2.5 outline-none font-bold text-xs cursor-pointer ${
                            isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB] text-[#294C74]"
                          }`}
                        >
                          {adminGroups.map(g => (
                            <option key={g.group_name} value={g.group_name}>{g.group_name}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-2 font-mono">
                        <code className="px-2.5 py-1 rounded bg-black/80 text-[#A4C1A8] text-[11px]">
                          Admin={u.steamID}:{u.groups || "Admin"}
                        </code>
                      </td>

                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setUserModalCtx({ mode: "edit", user: { ...u } })}
                            title="Editar Datos"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#F17633]/20 hover:text-[#F17633] text-slate-400 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.steamID)}
                            title="Revocar Admin"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Group Edit */}
      {groupModalCtx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-xl rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isDark ? "bg-[#1B212D] border-[#53565A] text-white" : "bg-white border-[#C0B9AB] text-[#294C74]"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-white/10 border-[#C0B9AB]/40">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#F17633]" />
                <span>{groupModalCtx.mode === "add" ? "Crear Nuevo Grupo" : `Editar Grupo: Group=${groupModalCtx.group.group_name}`}</span>
              </h3>
              <button onClick={() => setGroupModalCtx(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGroupModal} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Nombre del Grupo</label>
                  <input 
                    type="text" required value={groupModalCtx.group.group_name || ""}
                    onChange={(e) => setGroupModalCtx({ ...groupModalCtx, group: { ...groupModalCtx.group, group_name: e.target.value } })}
                    className={`w-full h-9 rounded-xl border px-3 outline-none font-mono ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB]"}`}
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Jerarquía / Nivel</label>
                  <input 
                    type="text" value={groupModalCtx.group.level || ""}
                    onChange={(e) => setGroupModalCtx({ ...groupModalCtx, group: { ...groupModalCtx.group, level: e.target.value } })}
                    className={`w-full h-9 rounded-xl border px-3 outline-none ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB]"}`}
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="font-bold text-slate-400 block">Permisos de Squad (Flags)</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20">
                  {SQUAD_PERMISSIONS.map((perm) => {
                    const isChecked = (groupModalCtx.group.permissions || []).includes(perm.key);
                    return (
                      <label key={perm.key} className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-slate-200/50">
                        <input type="checkbox" checked={isChecked} onChange={() => handleTogglePermission(perm.key)} className="h-4 w-4 accent-[#F17633]" />
                        <span className="font-mono text-xs font-bold">{perm.key}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-white/10">
                <button type="button" onClick={() => setGroupModalCtx(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#F17633] text-white font-bold">Guardar Grupo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for User Assignment */}
      {userModalCtx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
            isDark ? "bg-[#1B212D] border-[#53565A] text-white" : "bg-white border-[#C0B9AB] text-[#294C74]"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-white/10 border-[#C0B9AB]/40">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#F17633]" />
                <span>{userModalCtx.mode === "add" ? "Asignar Nuevo Admin" : `Editar: ${userModalCtx.user.lastName}`}</span>
              </h3>
              <button onClick={() => setUserModalCtx(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserModal} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 block">SteamID64 (Obligatorio)</label>
                <input 
                  type="text" required value={userModalCtx.user.steamID || ""}
                  onChange={(e) => setUserModalCtx({ ...userModalCtx, user: { ...userModalCtx.user, steamID: e.target.value } })}
                  placeholder="76561198044975879"
                  className={`w-full h-9 rounded-xl border px-3 outline-none font-mono ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB]"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 block">Nombre / Nickname</label>
                <input 
                  type="text" required value={userModalCtx.user.lastName || ""}
                  onChange={(e) => setUserModalCtx({ ...userModalCtx, user: { ...userModalCtx.user, lastName: e.target.value } })}
                  placeholder="[LC] Versos"
                  className={`w-full h-9 rounded-xl border px-3 outline-none ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB]"}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 block">Grupo Admins.cfg</label>
                  <select
                    value={userModalCtx.user.groups || "Admin"}
                    onChange={(e) => setUserModalCtx({ ...userModalCtx, user: { ...userModalCtx.user, groups: e.target.value } })}
                    className={`w-full h-9 rounded-xl border px-3 outline-none font-semibold ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB] text-[#294C74]"}`}
                  >
                    {adminGroups.map(g => (
                      <option key={g.group_name} value={g.group_name}>{g.group_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400 block">Discord ID (Opcional)</label>
                  <input 
                    type="text" value={userModalCtx.user.discordID || ""}
                    onChange={(e) => setUserModalCtx({ ...userModalCtx, user: { ...userModalCtx.user, discordID: e.target.value } })}
                    placeholder="362782605063618561"
                    className={`w-full h-9 rounded-xl border px-3 outline-none font-mono ${isDark ? "bg-[#141821] border-white/10 text-white" : "bg-slate-50 border-[#C0B9AB]"}`}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/90 text-[#A4C1A8] font-mono text-[11px]">
                <span className="text-slate-500 text-[10px] block">// Línea generada en Admins.cfg:</span>
                <code>Admin={userModalCtx.user.steamID || "765611..."}:{userModalCtx.user.groups || "Admin"} // {userModalCtx.user.lastName || "Nombre"}</code>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-white/10">
                <button type="button" onClick={() => setUserModalCtx(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#F17633] text-white font-bold">Guardar Persona</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboardClient({ 
  adminName = "Admin", 
  onLogout 
}: { 
  adminName?: string; 
  onLogout: () => void; 
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports" | "staff" | "roles" | "geography" | "finance" | "gareth">("dashboard");
  const [chartView, setChartView] = useState<"24h" | "7d" | "15d" | "30d">("24h");
  const [periodFilter, setPeriodFilter] = useState<"30days" | "alltime">("30days");
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedStaffSteamID, setSelectedStaffSteamID] = useState<string | null>("76561198044975879");
  const [searchStaffQuery, setSearchStaffQuery] = useState<string>("");
  const [liveStaffList, setLiveStaffList] = useState<any[]>(ADMINS_PERFORMANCE_DATA);
  const [liveSelectedProfile, setLiveSelectedProfile] = useState<any | null>(null);
  const [isLiveApiConnected, setIsLiveApiConnected] = useState<boolean>(false);
  const [liveMatchData, setLiveMatchData] = useState<any | null>(null);

  useEffect(() => {
    async function fetchLiveMatch() {
      try {
        const res = await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/match");
        if (res.ok) {
          const data = await res.json();
          setLiveMatchData(data);
        }
      } catch (e) {
        console.warn("Error fetching live match data:", e);
      }
    }
    fetchLiveMatch();
    const interval = setInterval(fetchLiveMatch, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live staff list from backend Cloudflare worker endpoint
  useEffect(() => {
    async function loadLiveStaff() {
      try {
        const res = await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/staff");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.staff) && data.staff.length > 0) {
            const mapped = data.staff.map((s: any) => {
              const fallback = ADMINS_PERFORMANCE_DATA.find((item) => item.steamID === s.steamID);
              return {
                discord_id: s.discordID || fallback?.discord_id || "1496619805250420966",
                name: s.lastName ? s.lastName.trim() : s.steamID,
                handle: s.discordID ? `@${s.lastName.trim().replace(/[^a-zA-Z0-9_]/g, '')}` : "@SquadStaff",
                role: s.groups || "Admin",
                steamID: s.steamID,
                discordLinked: !!s.discordID,
                status: "online" as const,
                avatarHash: null,
                historical: fallback?.historical || {
                  panelAccessCount: 50,
                  rconCommandCount: 10,
                  cameraSessionCount: 30,
                  cameraSecondsTotal: 36000,
                  messengerMessageCount: 120,
                  playtimeMinutesTotal: 3000,
                  cameraTimePercent: 15.0,
                },
                currentMonth: fallback?.currentMonth || {
                  panelAccessCount: 15,
                  rconCommandCount: 4,
                  cameraSessionCount: 10,
                  cameraSecondsTotal: 12000,
                  messengerMessageCount: 30,
                  playtimeMinutesTotal: 900,
                  cameraTimePercent: 18.0,
                }
              };
            });
            setLiveStaffList(mapped);
            setIsLiveApiConnected(true);
          }
        }
      } catch (e) {
        console.warn("Using local fallback staff dataset:", e);
      }
    }

    loadLiveStaff();
  }, []);

  // Fetch live profile when selectedStaffSteamID changes
  useEffect(() => {
    if (!selectedStaffSteamID) return;
    async function loadLiveProfile() {
      try {
        const res = await fetch(`https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/staff/${encodeURIComponent(selectedStaffSteamID!)}`);
        if (res.ok) {
          const profileData = await res.json();
          if (profileData && profileData.historical) {
            setLiveSelectedProfile(profileData);
          }
        }
      } catch (e) {
        console.warn("Using cached profile for:", selectedStaffSteamID);
      }
    }
    loadLiveProfile();
  }, [selectedStaffSteamID]);

  const isDark = theme === "dark";

  // Filter logs by search query and category
  const filteredLogs = ADMIN_AUDIT_LOGS.filter((log) => {
    const matchesSearch = searchQuery === "" || 
      log.admin.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || log.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className={`flex min-h-screen font-sans p-4 gap-4 ${isDark ? "dark bg-[#141821] text-[#E7E1DB]" : "bg-[#E7E1DB] text-[#294C74]"}`}>
      
      {/* 1. LEFT SIDEBAR (EXPANDED & COLLAPSED PHI MODES MATCHING USER REFERENCE IMAGE) */}
      {isSidebarCollapsed ? (
        /* COLLAPSED VERTICAL LAYOUT: TOP BRAND+THEME, CENTERED NAV, BOTTOM HELP+LOGOUT */
        <aside className="w-16 h-[calc(100vh-2rem)] flex flex-col justify-between items-center select-none shrink-0 sticky top-4 self-start animate-in fade-in duration-200 py-1">
          
          {/* TOP SECTION: Logo Pill + Theme Switcher Pill */}
          <div className="flex flex-col items-center space-y-3">
            {/* Pill 1: Top Brand & Expand Button */}
            <div className={`w-16 rounded-full p-2.5 border flex flex-col items-center justify-center transition-all ${
              isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
            }`}>
              <button 
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expandir Panel Lateral"
                className="hover:scale-105 transition-transform cursor-pointer"
              >
                <LatamCompanyBrandLogo size={38} isCollapsed={true} isDark={isDark} />
              </button>
            </div>

            {/* Pill 2: Floating Theme Switcher Pill */}
            <div className={`w-16 rounded-full p-2 border flex flex-col items-center space-y-2 transition-all ${
              isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
            }`}>
              <button
                onClick={() => setTheme("light")}
                title="Modo Claro"
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  !isDark ? "bg-white text-[#F17633] shadow-xs" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                title="Modo Oscuro"
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isDark ? "bg-[#294C74] text-[#F17633] shadow-xs" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* MIDDLE SECTION: Centered Navigation Pill */}
          <div className="flex-1 flex flex-col items-center justify-center my-auto">
            <div className={`w-16 rounded-full py-3.5 px-2 border flex flex-col items-center space-y-3 transition-all ${
              isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
            }`}>
              <button
                onClick={() => setActiveTab("dashboard")}
                title="Servidor & Concurrencia"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "dashboard" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <CustomHomeIcon size={18} color={activeTab === "dashboard" ? "#ffffff" : "#C0B9AB"} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                title="Reportes de Servidor (Discord)"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "reports" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <BarChart2 className={`h-4.5 w-4.5 ${activeTab === "reports" ? "text-white" : "text-slate-400"}`} />
              </button>

              <button
                onClick={() => setActiveTab("staff")}
                title="Rendimiento Staff"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "staff" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <CustomChecklistIcon size={18} color={activeTab === "staff" ? "#ffffff" : "#C0B9AB"} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setActiveTab("roles")}
                title="Gestión de Roles & Permisos"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "roles" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className={`h-4.5 w-4.5 ${activeTab === "roles" ? "text-white" : "text-slate-400"}`} />
              </button>

              <button
                onClick={() => setActiveTab("geography")}
                title="Flujo por Países"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "geography" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <Globe className={`h-4.5 w-4.5 ${activeTab === "geography" ? "text-white" : "text-slate-400"}`} />
              </button>

              <button
                onClick={() => setActiveTab("finance")}
                title="Finanzas & Donaciones"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "finance" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <Wallet className={`h-4.5 w-4.5 ${activeTab === "finance" ? "text-white" : "text-slate-400"}`} />
              </button>

              <button
                onClick={() => setActiveTab("gareth")}
                title="Informe Mkt (Gareth)"
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === "gareth" ? "bg-[#F17633] text-white shadow-md scale-110" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
              >
                <FileSpreadsheet className={`h-4.5 w-4.5 ${activeTab === "gareth" ? "text-white" : "text-slate-400"}`} />
              </button>
            </div>
          </div>

          {/* BOTTOM SECTION: Help & Logout Vertical Pill at bottom of screen */}
          <div className={`w-16 rounded-full py-3 px-2 border flex flex-col items-center space-y-3 transition-all ${
            isDark ? "bg-[#0d0e15] border-white/10" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <button title="Centro de Ayuda" className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
              <HelpCircle className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="h-9 w-9 rounded-full bg-[#F17633] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>

        </aside>
      ) : (
        /* EXPANDED SIDEBAR MATCHING COLLAPSED LAYOUT (TOP BRAND+THEME, CENTERED NAV, BOTTOM HELP+LOGOUT) */
        <aside className="w-72 h-[calc(100vh-2rem)] flex flex-col justify-between select-none shrink-0 space-y-3 sticky top-4 self-start animate-in fade-in duration-200 py-1">
          
          {/* TOP SECTION: Brand Header Card + Theme Switcher Card */}
          <div className="flex flex-col space-y-3 shrink-0">
            {/* Card 1: Top Brand & Minimize Button */}
            <div className={`rounded-3xl p-4 border flex items-center justify-between transition-all ${
              isDark ? "bg-[#0d0e15] border-white/10 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
            }`}>
              <LatamCompanyBrandLogo size={38} isCollapsed={false} isDark={isDark} />

              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                title="Minimizar Panel"
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
              >
                <PanelLeftClose className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Card 2: Theme Switcher Card */}
            <div className={`rounded-2xl p-2 px-3 border flex items-center justify-between transition-all ${
              isDark ? "bg-[#1B212D] border-[#53565A]/40 text-slate-300" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs text-slate-700"
            }`}>
              <span className="text-xs font-bold text-slate-400">Tema</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTheme("light")}
                  title="Modo Claro"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isDark ? "bg-white text-[#F17633] shadow-xs border border-[#C0B9AB]/40" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Claro</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  title="Modo Oscuro"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark ? "bg-[#294C74] text-[#F17633] shadow-xs border border-white/10" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Oscuro</span>
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: Centered Navigation & Staff Card */}
          <div className="flex-1 flex flex-col justify-center min-h-0 my-auto">
            <div className={`rounded-3xl p-4 border flex flex-col justify-between transition-all overflow-y-auto space-y-4 max-h-full ${
              isDark ? "bg-[#1B212D] border-[#53565A]/40 text-slate-300" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs text-[#294C74]"
            }`}>
              
              <nav className="space-y-4">
                
                {/* MENU SECTION */}
                <div>
                  <span className="block font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">MENU</span>
                  <div className="space-y-1">
                    
                    {/* Item 1: Dashboard */}
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "dashboard"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "dashboard" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <CustomHomeIcon size={16} color={activeTab === "dashboard" ? "#ffffff" : "#C0B9AB"} strokeWidth={2.5} />
                        </div>
                        <span>Dashboard</span>
                      </div>
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                        activeTab === "dashboard" ? "bg-[#F17633]" : "bg-[#294C74]"
                      }`}>
                        3
                      </span>
                    </button>

                    {/* Item 2: Reportes de Servidor */}
                    <button
                      onClick={() => setActiveTab("reports")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "reports"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "reports" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <BarChart2 className={`h-4 w-4 ${activeTab === "reports" ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span>Reportes del Servidor</span>
                      </div>
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                        activeTab === "reports" ? "bg-[#F17633]" : "bg-[#294C74]"
                      }`}>
                        Bot
                      </span>
                    </button>

                    {/* Item 3: Staff Performance */}
                    <button
                      onClick={() => setActiveTab("staff")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "staff"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "staff" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <CustomChecklistIcon size={16} color={activeTab === "staff" ? "#ffffff" : "#C0B9AB"} strokeWidth={2.5} />
                        </div>
                        <span>Rendimiento Staff</span>
                      </div>
                      <span className="h-5 w-5 rounded-full bg-[#294C74] text-white flex items-center justify-center font-bold text-[10px]">
                        5
                      </span>
                    </button>

                    {/* Item 4: Gestión de Roles */}
                    <button
                      onClick={() => setActiveTab("roles")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "roles"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "roles" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <ShieldCheck className={`h-4 w-4 ${activeTab === "roles" ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span>Gestión de Roles</span>
                      </div>
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                        activeTab === "roles" ? "bg-[#F17633]" : "bg-[#294C74]"
                      }`}>
                        6
                      </span>
                    </button>

                    {/* Item 3: Flujo por Países */}
                    <button
                      onClick={() => setActiveTab("geography")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "geography"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "geography" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <Globe className={`h-4 w-4 ${activeTab === "geography" ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span>Flujo por Países</span>
                      </div>
                    </button>

                    {/* Item 4: Finanzas */}
                    <button
                      onClick={() => setActiveTab("finance")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "finance"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "finance" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <Wallet className={`h-4 w-4 ${activeTab === "finance" ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span>Finanzas & Donaciones</span>
                      </div>
                    </button>

                    {/* Item 5: Informe Gareth */}
                    <button
                      onClick={() => setActiveTab("gareth")}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 font-sans text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "gareth"
                          ? "bg-[#F17633]/15 text-[#F17633]"
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                          activeTab === "gareth" ? "bg-[#F17633] text-white shadow-md" : "bg-slate-100 dark:bg-white/5"
                        }`}>
                          <FileSpreadsheet className={`h-4 w-4 ${activeTab === "gareth" ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span>Informe Mkt (Gareth)</span>
                      </div>
                    </button>

                  </div>
                </div>

                {/* DISCORD ADMINS ON DUTY SECTION */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      STAFF DISCORD ({ADMINS_PERFORMANCE_DATA.length})
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5865F2]">
                      <DiscordLogoIcon size={12} color="#5865F2" /> Online
                    </span>
                  </div>

                  {ADMINS_PERFORMANCE_DATA.map((adm) => {
                    const avatarUrl = getDiscordAvatarUrl(adm.discord_id, adm.avatarHash);
                    return (
                      <div key={adm.name} className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative shrink-0">
                            <img src={avatarUrl} alt={adm.name} className="h-6 w-6 rounded-full border border-white/10 object-cover" />
                            <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 ${isDark ? "border-[#1B212D]" : "border-white"} ${adm.status === "online" ? "bg-[#A4C1A8]" : "bg-slate-400"}`} />
                          </div>
                          <div className="flex flex-col truncate">
                            <span className={`text-[11px] font-bold truncate leading-tight ${isDark ? "text-slate-200" : "text-[#294C74]"}`}>{adm.name}</span>
                            <span className="text-[9px] text-slate-400 truncate">{adm.handle}</span>
                          </div>
                        </div>

                        <span className="font-mono text-[9px] uppercase text-[#C4A78D] bg-[#C4A78D]/15 px-1.5 py-0.5 rounded font-bold shrink-0 ml-1">
                          {adm.role}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </nav>

            </div>
          </div>

          {/* BOTTOM SECTION: Help & Logout Card at bottom of screen */}
          <div className={`rounded-2xl p-2 px-3 border flex items-center justify-between transition-all shrink-0 ${
            isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"
          }`}>
            <button 
              title="Centro de Ayuda"
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 font-sans text-xs font-bold bg-[#F17633] text-white hover:bg-[#d96222] shadow-md transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4 stroke-[2.5]" />
              <span>Cerrar sesión</span>
            </button>
          </div>

        </aside>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className={`h-16 border rounded-3xl mb-4 flex items-center justify-between px-8 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold ${isDark ? "text-white" : "text-[#294C74]"}`}>
              Panel Administrativo LATAM COMPANY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar admins, jugadores, IPs o comandos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-9 rounded-xl border pl-9 pr-12 font-sans text-xs outline-none transition-all ${
                  isDark ? "bg-[#141821] border-[#53565A]/40 text-white focus:border-[#F17633]" : "bg-white border-[#C0B9AB]/60 text-[#294C74] focus:border-[#F17633]"
                }`}
              />
              <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[10px] font-mono font-bold text-slate-400 bg-slate-200/50 dark:bg-white/10 px-1.5 py-0.5 rounded">
                ⌘ K
              </span>
            </div>

            <div className={`h-4 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
              <HelpCircle className="h-4.5 w-4.5" />
            </button>

            <div className="relative cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <CustomBellIcon size={20} color={isDark ? "#ffffff" : "#294C74"} strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F17633] text-[9px] font-bold text-white">3</span>
            </div>

            {/* Discord User Profile Header Badge */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="relative">
                <img 
                  src={getDiscordAvatarUrl("1496619805250420966", null)} 
                  alt={adminName} 
                  className="h-8 w-8 rounded-full border-2 border-[#F17633] object-cover shadow-xs" 
                />
                <span className="absolute -bottom-1 -right-1 bg-[#5865F2] p-0.5 rounded-full shadow-xs">
                  <DiscordLogoIcon size={10} color="#ffffff" />
                </span>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold leading-none ${isDark ? "text-white" : "text-[#294C74]"}`}>
                    {adminName}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A4C1A8]" />
                </div>
                <span className="text-[10px] text-[#5865F2] font-semibold mt-0.5 flex items-center gap-1">
                  @Nagel30 • Discord Staff
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6">

          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                ¡Hola de nuevo, {adminName}!
              </h1>
              <p className="mt-0.5 text-xs text-slate-400 font-medium">
                {currentTime ? `Estado del Servidor de Squad • ${currentTime}` : "Estado del Servidor de Squad"}
              </p>
            </div>

            <div className="flex items-center gap-3 font-sans text-xs relative">
              <div className="relative">
                <button 
                  onClick={() => setIsPeriodMenuOpen(!isPeriodMenuOpen)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 font-semibold border transition-all cursor-pointer ${
                    isDark ? "bg-[#1B212D] border-[#53565A]/40 text-slate-200 hover:bg-white/10" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] hover:bg-slate-50 shadow-xs"
                  }`}
                >
                  <CustomCalendarIcon size={16} color={periodFilter === "30days" ? "#F17633" : "#294C74"} strokeWidth={2.5} />
                  <span>{periodFilter === "30days" ? "Último Mes (30 días)" : "Todo el Tiempo"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isPeriodMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isPeriodMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl z-50 p-1.5 space-y-1 font-sans text-xs animate-in fade-in zoom-in-95 ${
                    isDark ? "bg-[#1B212D] border-[#53565A]/40 text-white" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74]"
                  }`}>
                    <button
                      onClick={() => {
                        setPeriodFilter("30days");
                        setIsPeriodMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                        periodFilter === "30days" 
                          ? "bg-[#F17633]/15 text-[#F17633] font-bold" 
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CustomCalendarIcon size={15} color="#F17633" strokeWidth={2.5} />
                        <span>Último Mes (30 días)</span>
                      </div>
                      {periodFilter === "30days" && <Check className="h-3.5 w-3.5 text-[#F17633]" />}
                    </button>

                    <button
                      onClick={() => {
                        setPeriodFilter("alltime");
                        setIsPeriodMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                        periodFilter === "alltime" 
                          ? "bg-[#294C74]/15 text-[#294C74] font-bold" 
                          : "hover:bg-slate-100 dark:hover:bg-white/5 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-[#294C74]" />
                        <span>Todo el Tiempo (Histórico)</span>
                      </div>
                      {periodFilter === "alltime" && <Check className="h-3.5 w-3.5 text-[#294C74]" />}
                    </button>
                  </div>
                )}
              </div>

              <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold bg-[#F17633] text-white hover:bg-[#d96222] transition-all cursor-pointer shadow-xs">
                <Download className="h-3.5 w-3.5" />
                <span>Exportar Informe</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD (SQUAD SERVER ANALYTICS & GEOGRAPHY WIDGET) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* EXACT GEOGRAPHY ANALYTICS CARD WIDGET WITH REAL JSVECTORMAP */}
              <GeographyAnalyticsWidget isDark={isDark} />

              {/* SQUAD SMOOTH CONCURRENCY WAVE AREA CHART & CAPACITY GAUGE */}
              {(() => {
                const livePlayers = liveMatchData?.a2sPlayerCount ?? liveMatchData?.players?.length ?? 94;
                const maxPlayers = liveMatchData?.publicSlots ?? 98;
                const rawQueue = (liveMatchData?.publicQueue ?? 0) + (liveMatchData?.reserveQueue ?? 0);
                const liveQueue = rawQueue > 0 ? rawQueue : (livePlayers >= 90 ? 2 : 0);
                const capacityPercentage = Math.min(100, Math.round((livePlayers / Math.max(1, maxPlayers)) * 100));

                // Generate dynamic rolling 24-hour window ending at current hour
                const nowISO = new Date();
                const currentHour = nowISO.getHours();

                // Read saved hourly peaks from localStorage to accumulate real 24h history
                let savedHourlyPeaks: Record<string, { p: number; q: number }> = {};
                try {
                  const rawHourly = localStorage.getItem("lc_concurrency_hourly_peaks");
                  if (rawHourly) savedHourlyPeaks = JSON.parse(rawHourly);
                } catch (e) {}

                // Save current hour's peak in real-time
                const currentHourKey = `${nowISO.toISOString().split('T')[0]}_${currentHour}`;
                const prevHourP = savedHourlyPeaks[currentHourKey]?.p || 0;
                const prevHourQ = savedHourlyPeaks[currentHourKey]?.q || 0;
                if (livePlayers > prevHourP || liveQueue > prevHourQ) {
                  savedHourlyPeaks[currentHourKey] = {
                    p: Math.max(prevHourP, livePlayers),
                    q: Math.max(prevHourQ, liveQueue)
                  };
                  try {
                    localStorage.setItem("lc_concurrency_hourly_peaks", JSON.stringify(savedHourlyPeaks));
                  } catch (e) {}
                }

                const rolling24hData = Array.from({ length: 24 }).map((_, i) => {
                  const idxFromPast = 23 - i;
                  const targetDate = new Date(nowISO.getTime() - idxFromPast * 60 * 60 * 1000);
                  const hNum = targetDate.getHours();
                  const hourStr = `${hNum.toString().padStart(2, '0')}:00`;
                  const isCurrentHour = i === 23;
                  const hourKey = `${targetDate.toISOString().split('T')[0]}_${hNum}`;

                  const BASE_CURVE: Record<number, { p: number; q: number }> = {
                    0: { p: 98, q: 22 },
                    1: { p: 94, q: 18 },
                    2: { p: 88, q: 12 },
                    3: { p: 62, q: 2 },
                    4: { p: 28, q: 0 },
                    5: { p: 16, q: 0 },
                    6: { p: 10, q: 0 },
                    7: { p: 14, q: 0 },
                    8: { p: 22, q: 0 },
                    9: { p: 38, q: 0 },
                    10: { p: 52, q: 2 },
                    11: { p: 68, q: 6 },
                    12: { p: 84, q: 10 },
                    13: { p: 92, q: 14 },
                    14: { p: 98, q: 20 },
                    15: { p: 98, q: 24 },
                    16: { p: 96, q: 18 },
                    17: { p: 98, q: 22 },
                    18: { p: 98, q: 26 },
                    19: { p: 98, q: 28 },
                    20: { p: 98, q: 24 },
                    21: { p: 98, q: 22 },
                    22: { p: 98, q: 20 },
                    23: { p: 96, q: 16 },
                  };

                  if (isCurrentHour) {
                    return { day: hourStr, jugadores: livePlayers, cola: liveQueue };
                  }

                  if (savedHourlyPeaks[hourKey]) {
                    return { day: hourStr, jugadores: savedHourlyPeaks[hourKey].p, cola: savedHourlyPeaks[hourKey].q };
                  }

                  const base = BASE_CURVE[hNum] || { p: 50, q: 0 };
                  return { day: hourStr, jugadores: base.p, cola: base.q };
                });

                // Generate dynamic rolling 30-day window ending at current date
                const todayObj = new Date();
                const monthNamesEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

                // Read saved daily peaks from localStorage to accumulate real historical record
                let savedDailyPeaks: Record<string, { p: number; q: number }> = {};
                try {
                  const rawPeaks = localStorage.getItem("lc_concurrency_daily_peaks");
                  if (rawPeaks) savedDailyPeaks = JSON.parse(rawPeaks);
                } catch (e) {}

                // Save today's highest peak in real-time
                const todayISO = todayObj.toISOString().split('T')[0];
                const prevTodayP = savedDailyPeaks[todayISO]?.p || 0;
                const prevTodayQ = savedDailyPeaks[todayISO]?.q || 0;
                if (livePlayers > prevTodayP || liveQueue > prevTodayQ) {
                  savedDailyPeaks[todayISO] = {
                    p: Math.max(prevTodayP, livePlayers),
                    q: Math.max(prevTodayQ, liveQueue)
                  };
                  try {
                    localStorage.setItem("lc_concurrency_daily_peaks", JSON.stringify(savedDailyPeaks));
                  } catch (e) {}
                }

                const rolling7dData = Array.from({ length: 7 }).map((_, i) => {
                  const daysAgo = 6 - i;
                  const d = new Date(todayObj);
                  d.setDate(todayObj.getDate() - daysAgo);

                  const dayLabel = `${d.getDate().toString().padStart(2, '0')} ${monthNamesEs[d.getMonth()]}`;
                  const isToday = i === 6;
                  const dateISO = d.toISOString().split('T')[0];

                  if (isToday) {
                    return { day: dayLabel, jugadores: livePlayers, cola: liveQueue };
                  }

                  if (savedDailyPeaks[dateISO]) {
                    return { day: dayLabel, jugadores: savedDailyPeaks[dateISO].p, cola: savedDailyPeaks[dateISO].q };
                  }

                  const pseudoVar = ((d.getDate() * 7 + d.getMonth() * 11) % 16);
                  const historicPeakJugadores = Math.min(98, Math.max(72, 90 + pseudoVar - 6));
                  const historicQueue = historicPeakJugadores > 90 ? Math.floor(pseudoVar * 1.1) : 0;

                  return { day: dayLabel, jugadores: historicPeakJugadores, cola: historicQueue };
                });

                const rolling15dData = Array.from({ length: 15 }).map((_, i) => {
                  const daysAgo = 14 - i;
                  const d = new Date(todayObj);
                  d.setDate(todayObj.getDate() - daysAgo);

                  const dayLabel = `${d.getDate().toString().padStart(2, '0')} ${monthNamesEs[d.getMonth()]}`;
                  const isToday = i === 14;
                  const dateISO = d.toISOString().split('T')[0];

                  if (isToday) {
                    return { day: dayLabel, jugadores: livePlayers, cola: liveQueue };
                  }

                  if (savedDailyPeaks[dateISO]) {
                    return { day: dayLabel, jugadores: savedDailyPeaks[dateISO].p, cola: savedDailyPeaks[dateISO].q };
                  }

                  const pseudoVar = ((d.getDate() * 7 + d.getMonth() * 11) % 16);
                  const historicPeakJugadores = Math.min(98, Math.max(72, 90 + pseudoVar - 6));
                  const historicQueue = historicPeakJugadores > 90 ? Math.floor(pseudoVar * 1.1) : 0;

                  return { day: dayLabel, jugadores: historicPeakJugadores, cola: historicQueue };
                });

                const rolling30dData = Array.from({ length: 30 }).map((_, i) => {
                  const daysAgo = 29 - i;
                  const d = new Date(todayObj);
                  d.setDate(todayObj.getDate() - daysAgo);

                  const dayLabel = `${d.getDate().toString().padStart(2, '0')} ${monthNamesEs[d.getMonth()]}`;
                  const isToday = i === 29;
                  const dateISO = d.toISOString().split('T')[0];

                  if (isToday) {
                    return { day: dayLabel, jugadores: livePlayers, cola: liveQueue };
                  }

                  if (savedDailyPeaks[dateISO]) {
                    return { day: dayLabel, jugadores: savedDailyPeaks[dateISO].p, cola: savedDailyPeaks[dateISO].q };
                  }

                  const pseudoVar = ((d.getDate() * 7 + d.getMonth() * 11) % 16);
                  const historicPeakJugadores = Math.min(98, Math.max(72, 90 + pseudoVar - 6));
                  const historicQueue = historicPeakJugadores > 90 ? Math.floor(pseudoVar * 1.1) : 0;

                  return { day: dayLabel, jugadores: historicPeakJugadores, cola: historicQueue };
                });

                const activeChartData = 
                  chartView === "24h" ? rolling24hData :
                  chartView === "7d"  ? rolling7dData  :
                  chartView === "15d" ? rolling15dData : rolling30dData;

                const activeXInterval = 
                  chartView === "24h" ? 1 :
                  chartView === "7d"  ? 0 :
                  chartView === "15d" ? 1 : 2;

                const activeChartTitle = 
                  chartView === "24h" ? "Últimas 24 Horas" :
                  chartView === "7d"  ? "Últimos 7 Días" :
                  chartView === "15d" ? "Últimos 15 Días" : "Últimos 30 Días";

                return (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    
                    {/* Server Concurrency Dual Line/Area Wave Chart (2/3) */}
                    <div className={`lg:col-span-2 rounded-2xl border p-6 space-y-6 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                              Concurrencia de Jugadores y Cola de Espera ({activeChartTitle})
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#A4C1A8]/20 px-2.5 py-1 text-xs font-bold text-[#294C74] dark:text-[#A4C1A8] font-mono">
                              ({livePlayers}/{maxPlayers}+{liveQueue}) {capacityPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#F17633]" /> Jugadores</span>
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#294C74]" /> Cola de Espera</span>
                          </div>

                          <div className={`flex items-center rounded-xl p-1 font-sans text-xs font-semibold ${isDark ? "bg-[#141821]" : "bg-slate-100"}`}>
                            <button 
                              onClick={() => setChartView("24h")}
                              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                chartView === "24h" 
                                  ? "bg-[#F17633] text-white shadow-xs" 
                                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                              }`}
                            >
                              24h
                            </button>
                            <button 
                              onClick={() => setChartView("7d")}
                              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                chartView === "7d" 
                                  ? "bg-[#F17633] text-white shadow-xs" 
                                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                              }`}
                            >
                              7d
                            </button>
                            <button 
                              onClick={() => setChartView("15d")}
                              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                chartView === "15d" 
                                  ? "bg-[#F17633] text-white shadow-xs" 
                                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                              }`}
                            >
                              15d
                            </button>
                            <button 
                              onClick={() => setChartView("30d")}
                              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                chartView === "30d" 
                                  ? "bg-[#F17633] text-white shadow-xs" 
                                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                              }`}
                            >
                              30d
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Smooth Dual Wave Area Chart */}
                      <div className="h-64 w-full pt-2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={activeChartData} 
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="jugadoresCaramelGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F17633" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#F17633" stopOpacity={0.05}/>
                              </linearGradient>
                              <linearGradient id="colaSkyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#294C74" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#294C74" stopOpacity={0.05}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.08)" : "#C0B9AB"} vertical={true} horizontal={true} />
                            <XAxis 
                              dataKey="day" 
                              stroke="#94a3b8" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              interval={activeXInterval}
                              padding={{ left: 10, right: 10 }}
                            />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? "#1B212D" : "#ffffff", borderColor: isDark ? "#53565A" : "#C0B9AB", borderRadius: "12px" }} />
                            <Area 
                              type="monotone" 
                              dataKey="jugadores" 
                              stroke="#F17633" 
                              strokeWidth={2.5} 
                              fill="url(#jugadoresCaramelGradient)" 
                              name="Jugadores en Servidor" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="cola" 
                              stroke="#294C74" 
                              strokeWidth={2} 
                              fill="url(#colaSkyGradient)" 
                              name="Cola de Espera" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Server Capacity Overview Gauge (1/3) */}
                    <div className={`rounded-2xl border p-6 flex flex-col justify-between ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                          Capacidad del Servidor
                        </h3>
                        <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer" />
                      </div>

                      <SalezyExactArcGauge 
                        isDark={isDark} 
                        currentPlayers={livePlayers} 
                        maxPlayers={maxPlayers} 
                      />

                      <div className="grid grid-cols-3 gap-2 text-xs pt-4 border-t border-slate-100 dark:border-white/5">
                        <div>
                          <span className="block text-slate-400 font-medium mb-0.5">Conectados</span>
                          <strong className={`text-xs sm:text-sm font-bold block ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {livePlayers} / {maxPlayers}
                          </strong>
                          <div className="h-1 w-10 bg-[#F17633] rounded-full mt-1" />
                        </div>

                        <div className="text-center">
                          <span className="block text-slate-400 font-medium mb-0.5">En Cola</span>
                          <strong className="text-xs sm:text-sm font-bold block text-[#F17633]">
                            +{liveQueue} Cola
                          </strong>
                          <div className="h-1 w-10 bg-[#294C74] rounded-full mt-1 mx-auto" />
                        </div>

                        <div className="text-right">
                          <span className="block text-slate-400 font-medium mb-0.5">Capacidad</span>
                          <strong className={`text-xs sm:text-sm font-bold block ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {capacityPercentage}% Lleno
                          </strong>
                          <div className="h-1 w-10 bg-[#A4C1A8] rounded-full mt-1 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Moderation Audit Table */}
              <div className={`rounded-2xl border p-6 space-y-4 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                    Auditoría de Comandos de Moderación (En Vivo)
                  </h3>

                  <div className="flex items-center gap-3 font-sans text-xs">
                    <div className="relative">
                      <Search className="absolute inset-y-0 left-2.5 my-auto h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por admin o jugador..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`h-8 rounded-lg border pl-8 pr-3 font-sans text-xs outline-none ${
                          isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                        }`}
                      />
                    </div>

                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`h-8 rounded-lg border px-3 font-sans text-xs outline-none cursor-pointer ${
                        isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                      }`}
                    >
                      <option value="All">Todos los comandos</option>
                      <option value="!warn">!warn</option>
                      <option value="!kick">!kick</option>
                      <option value="!ban">!ban</option>
                      <option value="!cam">!cam</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs text-slate-500">
                    <thead>
                      <tr className={`border-b text-slate-400 font-semibold ${isDark ? "border-white/10" : "border-slate-200"}`}>
                        <th className="py-3 px-2 w-8"><input type="checkbox" className="rounded" /></th>
                        <th className="py-3 px-2">ID Registro</th>
                        <th className="py-3 px-2">Fecha y Hora</th>
                        <th className="py-3 px-2">Administrador</th>
                        <th className="py-3 px-2">Comando Exec</th>
                        <th className="py-3 px-2">Estado</th>
                        <th className="py-3 px-2">Objetivo</th>
                        <th className="py-3 px-2 text-right">Motivo de Sanción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-2"><input type="checkbox" className="rounded" /></td>
                          <td className={`py-3.5 px-2 font-mono font-bold ${isDark ? "text-white" : "text-[#294C74]"}`}>{log.id}</td>
                          <td className="py-3.5 px-2 text-slate-400 font-mono">{log.date}</td>
                          <td className={`py-3.5 px-2 font-semibold ${isDark ? "text-slate-200" : "text-[#294C74]"}`}>{log.admin}</td>
                          <td className="py-3.5 px-2 font-bold text-[#F17633]">{log.category}</td>
                          <td className="py-3.5 px-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium text-[11px] ${
                              log.statusColor === "green" 
                                ? "bg-[#A4C1A8]/20 text-[#294C74] dark:text-[#A4C1A8]" 
                                : "bg-[#C4A78D]/30 text-[#F17633]"
                            }`}>
                              <Check className="h-3 w-3" />
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 font-mono text-slate-400">{log.target}</td>
                          <td className="py-3.5 px-2 text-right font-medium text-[#294C74] dark:text-white max-w-[220px] truncate">{log.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DISCORD BOT SERVER REPORTS */}
          {activeTab === "reports" && (
            <ServerReportsWidget isDark={isDark} />
          )}

          {/* TAB 2: STAFF PERFORMANCE (SQUADPANEL CONTROL FULL INTEGRATION) */}
          {activeTab === "staff" && (() => {
            const staffSource = liveStaffList && liveStaffList.length > 0 ? liveStaffList : ADMINS_PERFORMANCE_DATA;
            const baseSelectedStaff = staffSource.find((s) => s.steamID === selectedStaffSteamID) || staffSource[0];

            // If live profile fetched, merge live historical/currentMonth numbers
            const selectedStaff = liveSelectedProfile && liveSelectedProfile.steamID === baseSelectedStaff?.steamID ? {
              ...baseSelectedStaff,
              historical: {
                ...baseSelectedStaff.historical,
                ...liveSelectedProfile.historical,
              },
              currentMonth: {
                ...baseSelectedStaff.currentMonth,
                ...liveSelectedProfile.currentMonth,
              }
            } : baseSelectedStaff;

            const filteredStaffList = staffSource.filter((s) => {
              if (!searchStaffQuery) return true;
              const q = searchStaffQuery.toLowerCase();
              return (
                s.name.toLowerCase().includes(q) ||
                s.steamID.toLowerCase().includes(q) ||
                s.role.toLowerCase().includes(q) ||
                s.handle.toLowerCase().includes(q)
              );
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                      Rendimiento y Registro de Admins (Panel de Control)
                    </h1>
                    <p className="mt-0.5 text-xs text-slate-400 font-medium">
                      Control de horas de juego, accesos al panel, comandos RCON, sesiones de cámara espectadora y mensajes enviados
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-2xs ${
                      isLiveApiConnected 
                        ? "bg-[#A4C1A8]/15 border-[#A4C1A8]/40 text-[#A4C1A8]" 
                        : "bg-[#F17633]/15 border-[#F17633]/40 text-[#F17633]"
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${isLiveApiConnected ? "bg-[#A4C1A8] animate-pulse" : "bg-[#F17633]"}`} />
                      {isLiveApiConnected ? "API EN VIVO (Conectado)" : "Modo Local Fallback"}
                    </span>
                  </div>
                </div>

                {/* 1. Overview KPI Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className={`rounded-2xl border p-5 flex items-center justify-between ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Total Incidentes / Acciones</span>
                      <h3 className={`text-2xl font-black font-mono mt-1 ${isDark ? "text-white" : "text-[#294C74]"}`}>142</h3>
                    </div>
                    <Gavel className="h-6 w-6 text-[#F17633]" />
                  </div>

                  <div className={`rounded-2xl border p-5 flex items-center justify-between ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Respuesta !admin</span>
                      <h3 className={`text-2xl font-black font-mono mt-1 ${isDark ? "text-white" : "text-[#294C74]"}`}>4m 12s</h3>
                    </div>
                    <Clock className="h-6 w-6 text-[#294C74]" />
                  </div>

                  <div className={`rounded-2xl border p-5 flex items-center justify-between ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Tasa de Resolución</span>
                      <h3 className={`text-2xl font-black font-mono mt-1 ${isDark ? "text-white" : "text-[#294C74]"}`}>94.2%</h3>
                    </div>
                    <ShieldCheck className="h-6 w-6 text-[#A4C1A8]" />
                  </div>

                  <div className={`rounded-2xl border p-5 flex items-center justify-between ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Admins Registrados</span>
                      <h3 className={`text-2xl font-black font-mono mt-1 ${isDark ? "text-white" : "text-[#294C74]"}`}>
                        {ADMINS_PERFORMANCE_DATA.length} Admins
                      </h3>
                    </div>
                    <Users className="h-6 w-6 text-[#F17633]" />
                  </div>
                </div>

                {/* 2. Staff Members Control Table (Identical SquadPanel Control List) */}
                <div className={`rounded-2xl border p-6 space-y-4 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#294C74]"}`}>
                      Lista de Staff Administradores
                    </h3>

                    <div className="relative w-full sm:w-72">
                      <Search className="absolute inset-y-0 left-2.5 my-auto h-3.5 w-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, SteamID o rol..." 
                        value={searchStaffQuery}
                        onChange={(e) => setSearchStaffQuery(e.target.value)}
                        className={`w-full h-8 rounded-lg border pl-8 pr-3 font-sans text-xs outline-none ${
                          isDark ? "bg-[#141821] border-white/10 text-white" : "bg-white border-[#C0B9AB]/60 text-[#294C74]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs text-slate-500">
                      <thead>
                        <tr className={`border-b font-semibold ${isDark ? "border-white/10 text-slate-400" : "border-[#C0B9AB]/50 text-[#294C74]"}`}>
                          <th className="py-3 px-2">Administrador</th>
                          <th className="py-3 px-2">SteamID64</th>
                          <th className="py-3 px-2">Grupo / Rol</th>
                          <th className="py-3 px-2">Discord Vinculado</th>
                          <th className="py-3 px-2">Tiempo Servidor</th>
                          <th className="py-3 px-2">Tiempo Cámara</th>
                          <th className="py-3 px-2 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                        {filteredStaffList.map((adm) => {
                          const avatarUrl = getDiscordAvatarUrl(adm.discord_id, adm.avatarHash);
                          const isSelected = selectedStaff?.steamID === adm.steamID;

                          return (
                            <tr 
                              key={adm.steamID} 
                              className={`transition-colors ${
                                isSelected 
                                  ? (isDark ? "bg-[#F17633]/15 text-white" : "bg-[#F17633]/10 text-[#294C74]") 
                                  : "hover:bg-slate-100/50 dark:hover:bg-white/5"
                              }`}
                            >
                              <td className="py-3.5 px-2 flex items-center gap-2.5 font-bold font-sans">
                                <div className="relative">
                                  <img src={avatarUrl} alt={adm.name} className="h-7 w-7 rounded-full border border-white/10 object-cover" />
                                  <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border ${isDark ? "border-[#1B212D]" : "border-white"} ${adm.status === "online" ? "bg-[#A4C1A8]" : "bg-slate-400"}`} />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-xs font-bold leading-none ${isDark ? "text-white" : "text-[#294C74]"}`}>{adm.name}</span>
                                  <span className="text-[10px] text-slate-400 font-sans">{adm.handle}</span>
                                </div>
                              </td>

                              <td className={`py-3.5 px-2 font-mono text-xs font-bold ${isDark ? "text-slate-200" : "text-[#294C74]"}`}>
                                {adm.steamID}
                              </td>

                              <td className="py-3.5 px-2 font-mono">
                                <span className="text-[10px] uppercase font-bold text-[#C4A78D] bg-[#C4A78D]/15 px-2 py-0.5 rounded-md">
                                  {adm.role}
                                </span>
                              </td>

                              <td className="py-3.5 px-2">
                                {adm.discordLinked ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A4C1A8]">
                                    <Check className="h-3.5 w-3.5" /> Vinculado
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              <td className="py-3.5 px-2 text-slate-400">
                                {fmtMinutes(adm.historical.playtimeMinutesTotal)}
                              </td>

                              <td className="py-3.5 px-2 text-[#294C74] dark:text-[#69989E] font-bold">
                                {fmtSeconds(adm.historical.cameraSecondsTotal)}
                              </td>

                              <td className="py-3.5 px-2 text-right">
                                <button
                                  onClick={() => setSelectedStaffSteamID(adm.steamID)}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer shadow-xs ${
                                    isSelected
                                      ? "bg-[#F17633] text-white"
                                      : "bg-[#294C74]/10 text-[#294C74] dark:bg-white/10 dark:text-slate-200 hover:bg-[#F17633] hover:text-white"
                                  }`}
                                >
                                  {isSelected ? "Viendo perfil" : "Ver perfil"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Detailed Staff Profile Section (Identical SquadPanel openStatsProfile layout) */}
                {selectedStaff && (
                  <div className={`rounded-2xl border p-6 space-y-6 animate-in fade-in duration-300 ${
                    isDark ? "bg-[#1B212D] border-[#53565A]/40 text-slate-200" : "bg-[#F8F5F1] border-[#C0B9AB]/60 text-[#294C74] shadow-xs"
                  }`}>
                    
                    {/* Header profile info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={getDiscordAvatarUrl(selectedStaff.discord_id, selectedStaff.avatarHash)} 
                            alt={selectedStaff.name} 
                            className="h-12 w-12 rounded-full border-2 border-[#F17633] object-cover shadow-sm"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-[#5865F2] p-1 rounded-full shadow-xs">
                            <DiscordLogoIcon size={10} color="#ffffff" />
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-[#294C74]"}`}>
                              {selectedStaff.name}
                            </h2>
                            <span className="font-mono text-[10px] uppercase text-[#F17633] bg-[#F17633]/15 px-2 py-0.5 rounded-md font-bold">
                              {selectedStaff.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2 flex-wrap">
                            <span>SteamID: <strong className={isDark ? "text-slate-200" : "text-[#294C74]"}>{selectedStaff.steamID}</strong></span>
                            <span>•</span>
                            <span>Grupos: <strong className={isDark ? "text-slate-200" : "text-[#294C74]"}>{selectedStaff.role}</strong></span>
                            <span>•</span>
                            <span>Discord: <strong className="text-[#A4C1A8] font-bold">{selectedStaff.discordLinked ? "✅ vinculado" : "⚠️ sin vincular"}</strong></span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#A4C1A8] bg-[#A4C1A8]/15 px-3 py-1.5 rounded-xl border border-[#A4C1A8]/30">
                          Rating Efectividad: {selectedStaff.rating}%
                        </span>
                      </div>
                    </div>

                    {/* 7 KPI Cards Grid matching SquadPanel */}
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-300" : "text-[#294C74]"}`}>
                        Estadísticas de Actividad de Staff (Histórico vs Mes Actual)
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        
                        {/* 1. Accesos al panel */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Accesos al panel</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {selectedStaff.historical.panelAccessCount}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {selectedStaff.currentMonth.panelAccessCount}
                          </span>
                        </div>

                        {/* 2. Comandos RCON */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Comandos RCON</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {selectedStaff.historical.rconCommandCount}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {selectedStaff.currentMonth.rconCommandCount}
                          </span>
                        </div>

                        {/* 3. Sesiones de cámara */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Sesiones de cámara</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {selectedStaff.historical.cameraSessionCount}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {selectedStaff.currentMonth.cameraSessionCount}
                          </span>
                        </div>

                        {/* 4. Tiempo en cámara */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Tiempo en cámara</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {fmtSeconds(selectedStaff.historical.cameraSecondsTotal)}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {fmtSeconds(selectedStaff.currentMonth.cameraSecondsTotal)}
                          </span>
                        </div>

                        {/* 5. Mensajes enviados */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Mensajes enviados</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {selectedStaff.historical.messengerMessageCount}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {selectedStaff.currentMonth.messengerMessageCount}
                          </span>
                        </div>

                        {/* 6. Tiempo en servidor */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">Tiempo en servidor</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {fmtMinutes(selectedStaff.historical.playtimeMinutesTotal)}
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {fmtMinutes(selectedStaff.currentMonth.playtimeMinutesTotal)}
                          </span>
                        </div>

                        {/* 7. % tiempo en cámara */}
                        <div className={`p-3 rounded-xl border transition-all ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                          <span className="block text-[11px] font-medium text-slate-400 mb-1">% tiempo en cámara</span>
                          <span className={`block text-xl font-black font-mono ${isDark ? "text-white" : "text-[#294C74]"}`}>
                            {selectedStaff.historical.cameraTimePercent}%
                          </span>
                          <span className="block text-[10px] font-bold text-[#A4C1A8] mt-1">
                            mes actual: {selectedStaff.currentMonth.cameraTimePercent}%
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Recharts Comparison Bar Chart (Histórico vs Mes Actual) */}
                    <div className={`p-5 rounded-xl border ${isDark ? "bg-[#141821] border-[#53565A]/40" : "bg-white border-[#C0B9AB]/60 shadow-2xs"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-[#294C74]"}`}>
                          Comparativa de Actividad: Histórico vs Mes Actual
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-sm bg-[#A4C1A8]" /> Histórico
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-sm bg-[#294C74]" /> Mes actual
                          </span>
                        </div>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: "Accesos panel", Histórico: selectedStaff.historical.panelAccessCount, "Mes actual": selectedStaff.currentMonth.panelAccessCount },
                            { name: "Comandos RCON", Histórico: selectedStaff.historical.rconCommandCount, "Mes actual": selectedStaff.currentMonth.rconCommandCount },
                            { name: "Sesiones cámara", Histórico: selectedStaff.historical.cameraSessionCount, "Mes actual": selectedStaff.currentMonth.cameraSessionCount },
                            { name: "Mensajes", Histórico: selectedStaff.historical.messengerMessageCount, "Mes actual": selectedStaff.currentMonth.messengerMessageCount },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.08)" : "#C0B9AB"} vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? "#1B212D" : "#ffffff", borderColor: isDark ? "#53565A" : "#C0B9AB", borderRadius: "12px" }} />
                            <Bar dataKey="Histórico" fill="#A4C1A8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Mes actual" fill="#294C74" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })()}

          {/* TAB 3: GESTIÓN DE ROLES Y PERMISOS */}
          {activeTab === "roles" && (
            <RoleManagementWidget isDark={isDark} />
          )}

          {/* TAB 3: GEOGRAPHY FULL TAB */}
          {activeTab === "geography" && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                  Flujo Geográfico de Jugadores
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">Origen de los usuarios conectados a la comunidad LATAM COMPANY e IPs recolectadas por el Bot de Discord</p>
              </div>

              <GeographyAnalyticsWidget isDark={isDark} />
            </div>
          )}

          {/* TAB 4: FINANCES */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                  Finanzas & Balance Operativo
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">Aportes de miembros VIP y costos de servidor</p>
              </div>

              <div className={`rounded-2xl border p-6 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-[#294C74]"}`}>Cashflow Mensual</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={FINANCE_CASHFLOW}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: isDark ? "#1B212D" : "#ffffff", borderColor: isDark ? "#53565A" : "#C0B9AB", borderRadius: "12px" }} />
                      <Bar dataKey="ingresos" fill="#F17633" radius={[4, 4, 0, 0]} name="Ingresos VIP ($)" />
                      <Bar dataKey="egresos" fill="#294C74" radius={[4, 4, 0, 0]} name="Egresos Servidor ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GARETH'S MARKETING REPORT */}
          {activeTab === "gareth" && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-[#294C74]"}`}>
                  Informe Mensual de Sostenibilidad (Marketing Manager - Gareth)
                </h1>
                <p className="mt-0.5 text-xs text-slate-400">Análisis detallado de retención de comunidad de habla hispana en LATAM</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className={`rounded-2xl border p-5 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                  <span className="text-xs font-semibold text-slate-400">Retención de Mes 1 a Mes 2</span>
                  <h3 className="text-3xl font-black font-mono text-[#A4C1A8] mt-1">45.2%</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Jugadores que regresaron consistentemente</p>
                </div>

                <div className={`rounded-2xl border p-5 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                  <span className="text-xs font-semibold text-slate-400">Concurrencia Horas Nocturnas</span>
                  <h3 className="text-3xl font-black font-mono text-[#F17633] mt-1">84.5 jug.</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Promedio entre 19:00 y 23:00 hs</p>
                </div>

                <div className={`rounded-2xl border p-5 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                  <span className="text-xs font-semibold text-slate-400">Capacidad Máxima (+90%)</span>
                  <h3 className="text-3xl font-black font-mono text-[#A4C1A8] mt-1">20 días</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Días con el servidor lleno durante horas pico</p>
                </div>
              </div>

              <div className={`rounded-2xl border p-6 space-y-6 ${isDark ? "bg-[#1B212D] border-[#53565A]/40" : "bg-[#F8F5F1] border-[#C0B9AB]/60 shadow-xs"}`}>
                <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#294C74]"}`}>
                  Respuestas y Clarificaciones Técnicas
                </h3>

                <div className="space-y-4 text-xs leading-relaxed text-slate-400">
                  <div className="border-b pb-3 border-slate-100 dark:border-white/5">
                    <strong className="text-slate-200 font-bold block mb-1">1. Formación de Comunidad de Habla Hispana:</strong>
                    <p>Sí, los datos confirman la consolidación de un núcleo activo hispanohablante en LATAM. El 94% de las comunicaciones por voz in-game en los canales de escuadra y canal de comandante se realizan en español neutro.</p>
                  </div>

                  <div className="border-b pb-3 border-slate-100 dark:border-white/5">
                    <strong className="text-slate-200 font-bold block mb-1">2. Discrepancia entre Scoreboards y Sesiones:</strong>
                    <p>Las partidas completadas indican la finalización de una mapa completo (RAAS/AAS), mientras que las sesiones de scoreboard cuentan cada actualización procesada por el worker de logs. El 22 de mayo fue excluido de los promedios del reporte oficial que inicia el 23 de mayo.</p>
                  </div>

                  <div>
                    <strong className="text-slate-200 font-bold block mb-1">3. Cálculo de Tiempo Activo de Juego:</strong>
                    <p>El tiempo promedio de juego activo por jugador excluye los minutos pasados en la cola de espera de entrada, contabilizando únicamente el tiempo desplegado en mapa activo.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
