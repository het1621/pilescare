import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
} from "lucide-react";
import api from "../../../lib/api";

export default function DashboardOverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appts, contacts, blogs] = await Promise.allSettled([
          api.get("/appointments"),
          api.get("/contact"),
          api.get("/blog"),
        ]);

        const allAppts = appts.status === "fulfilled" ? appts.value.data : [];
        const allContacts = contacts.status === "fulfilled" ? contacts.value.data : [];
        const allBlogs = blogs.status === "fulfilled" ? blogs.value.data : [];

        // Compute stats
        const today = new Date().toISOString().slice(0, 10);
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        const thisMonthStart = new Date();
        thisMonthStart.setDate(1);

        const todayAppts = allAppts.filter(
          (a) => a.preferred_date?.slice(0, 10) === today
        );
        const weekAppts = allAppts.filter(
          (a) => new Date(a.preferred_date) >= thisWeekStart
        );
        const monthAppts = allAppts.filter(
          (a) => new Date(a.preferred_date) >= thisMonthStart
        );

        const pending = allAppts.filter((a) => a.status === "pending").length;
        const confirmed = allAppts.filter((a) => a.status === "confirmed").length;
        const completed = allAppts.filter((a) => a.status === "completed").length;
        const cancelled = allAppts.filter((a) => a.status === "cancelled").length;

        setStats({
          today: todayAppts.length,
          thisWeek: weekAppts.length,
          thisMonth: monthAppts.length,
          total: allAppts.length,
          pending,
          confirmed,
          completed,
          cancelled,
          contacts: allContacts.length,
          blogs: allBlogs.length,
        });
      } catch (err) {
        console.error("Dashboard stats error", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-brand-subtle rounded-2xl p-5 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mt-6 text-center text-brand-textMuted py-20">
        Failed to load dashboard data
      </div>
    );
  }

  const statCards = [
    {
      label: "Today",
      value: stats.today,
      Icon: Calendar,
      color: "text-brand-accent",
      bg: "bg-amber-50",
    },
    {
      label: "This Week",
      value: stats.thisWeek,
      Icon: TrendingUp,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      Icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "All Time",
      value: stats.total,
      Icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const statusCards = [
    {
      label: "Pending",
      value: stats.pending,
      Icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      ring: "ring-amber-200",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      Icon: CheckCircle,
      color: "text-sky-600",
      bg: "bg-sky-50",
      ring: "ring-sky-200",
    },
    {
      label: "Completed",
      value: stats.completed,
      Icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ring: "ring-emerald-200",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      Icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      ring: "ring-rose-200",
    },
  ];

  return (
    <div className="mt-2 space-y-8">
      {/* Appointment Stats */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-4 font-semibold">
          Appointments Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white border border-brand-primary/8 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={18} className={color} />
                </div>
              </div>
              <div className="font-serif text-3xl text-brand-text font-semibold">
                {value}
              </div>
              <div className="text-xs text-brand-textMuted mt-1 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Breakdown */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-4 font-semibold">
          By Status
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map(({ label, value, Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white border border-brand-primary/8 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon size={14} className={color} />
                </div>
                <span className="text-xs text-brand-textSecondary uppercase tracking-wider font-medium">{label}</span>
              </div>
              <div className={`font-serif text-3xl font-semibold ${color}`}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-4 font-semibold">
          Content & Messages
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-brand-primary/8 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <MessageSquare size={20} className="text-violet-600" />
            </div>
            <div>
              <div className="font-serif text-2xl text-brand-text font-semibold">{stats.contacts}</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Contact Messages</div>
            </div>
          </div>
          <div className="bg-white border border-brand-primary/8 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <BookOpen size={20} className="text-brand-accent" />
            </div>
            <div>
              <div className="font-serif text-2xl text-brand-text font-semibold">{stats.blogs}</div>
              <div className="text-xs text-brand-textMuted uppercase tracking-wider">Blog Posts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
