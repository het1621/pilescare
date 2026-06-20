import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";

const STATUS_STYLES = {
  pending: "bg-amber-50  text-amber-700  border-amber-200",
  confirmed: "bg-sky-50    text-sky-700    border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50   text-rose-700   border-rose-200",
};
const STATUS_ICONS = {
  pending: <Clock size={13} />,
  confirmed: <CheckCircle size={13} />,
  completed: <CheckCircle size={13} />,
  cancelled: <XCircle size={13} />,
};

export default function AppointmentsTab() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const { data } = await api.get(`/appointments${params}`);
      setAppts(data);
    } catch (err) {
      const msg =
        formatApiError(err.response?.data?.detail) ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Request failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await api.patch(`/appointments/${id}`, { status });

      // Show contextual toast based on email delivery result
      if (data.emailSent) {
        toast.success(`Marked as ${status} — email sent to patient ✉️`);
      } else if (data.emailSkipReason === "no_email") {
        toast.warning(
          `Marked as ${status} — no email (patient didn't provide one)`,
        );
      } else if (data.emailSkipReason === "send_failed") {
        toast.error(`Marked as ${status} — but email failed to send`);
      } else {
        toast.success(`Marked as ${status}`);
      }

      load();
    } catch (err) {
      const msg =
        formatApiError(err.response?.data?.detail) ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Request failed";
      toast.error(msg);
    } finally {
      setUpdating(null);
    }
  };

  const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <div className="mt-6">
      {/* Filter bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all
                ${filter === f ? "bg-brand-primary text-white" : "bg-white border border-brand-primary/15 text-brand-textSecondary hover:border-brand-primary"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg border border-brand-primary/10 text-brand-textSecondary hover:bg-brand-subtle transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {loading ? (
          <div className="p-14 text-center text-brand-textMuted">
            <Loader2 size={20} className="animate-spin inline mr-2" />
            Loading…
          </div>
        ) : appts.length === 0 ? (
          <div className="p-14 text-center text-brand-textMuted">
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-primary/5 bg-brand-subtle">
                  {[
                    "Patient",
                    "Contact",
                    "Date & Time",
                    "Type",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-brand-textMuted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {appts.map((a) => (
                  <tr
                    key={a._id}
                    className="hover:bg-brand-subtle/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-brand-text">
                        {a.patient_name}
                      </div>
                      {a.email && (
                        <div className="text-xs text-brand-textMuted mt-0.5">
                          {a.email}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-brand-textSecondary">
                      {a.contact_number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-brand-text font-medium">
                        {a.preferred_date}
                      </div>
                      <div className="text-xs text-brand-textMuted">
                        {a.time_slot}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full
                        ${a.consultation_type === "online" ? "bg-violet-50 text-violet-700" : "bg-brand-secondary text-brand-primary"}`}
                      >
                        {a.consultation_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[a.status]}`}
                      >
                        {STATUS_ICONS[a.status]} {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {updating === a._id ? (
                          <Loader2
                            size={14}
                            className="animate-spin text-brand-textMuted"
                          />
                        ) : (
                          <select
                            value={a.status}
                            onChange={(e) =>
                              updateStatus(a._id, e.target.value)
                            }
                            className="text-xs border border-brand-primary/15 rounded-lg px-2 py-1.5 text-brand-text bg-white cursor-pointer outline-none focus:border-brand-primary"
                          >
                            {[
                              "pending",
                              "confirmed",
                              "completed",
                              "cancelled",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-brand-textMuted mt-3">
        {appts.length} appointment{appts.length !== 1 ? "s" : ""} shown
      </p>
    </div>
  );
}
