import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

const statusColors: Record<string, string> = {
  applied: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  interview: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  offer: "bg-green-500/10 text-green-400 border border-green-500/20",
};

const SkeletonRow = () => (
  <tr className="border-t border-gray-700/50 animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!company.trim() || !position.trim()) {
      toast.warning("Company and position are required");
      return;
    }
    setIsAdding(true);
    try {
      await api.post("/applications", { company, position, notes });
      const res = await api.get("/applications");
      setApplications(res.data);
      setCompany("");
      setPosition("");
      setNotes("");
      toast.success(`Added application to ${company}`);
    } catch {
      toast.error("Failed to add application");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      toast.success("Application removed");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          My Applications
        </h1>

        {/* Форма добавления */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6 md:mb-8 flex flex-col md:flex-row gap-3 md:gap-4">
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <input
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded font-semibold w-full md:w-auto transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>

        {/* Десктоп: таблица */}
        <div className="hidden md:block">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700/80">
              <tr>
                {[
                  "Company",
                  "Position",
                  "Status",
                  "Notes",
                  "Date Applied",
                  "Update",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 text-left text-sm font-medium text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialLoading ? (
                [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No applications yet. Add your first one above.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t border-gray-700/50 hover:bg-gray-700/40 transition-colors duration-100"
                  >
                    <td className="p-4 font-medium">{app.company}</td>
                    <td className="p-4 text-gray-300">{app.position}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[app.status] ?? "bg-gray-700 text-gray-300"}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{app.notes}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {app.date_applied.slice(0, 10)}
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatus(app.id, e.target.value)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-sm transition-colors cursor-pointer"
                      >
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="offer">Offer</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 px-4 py-2 rounded text-sm transition-all duration-150 active:scale-95 flex items-center gap-2"
                      >
                        {deletingId === app.id ? (
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Мобайл: карточки */}
        <div className="flex flex-col gap-4 md:hidden">
          {initialLoading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg p-4 animate-pulse"
                >
                  <div className="h-5 bg-gray-700 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
              ))
            : applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 flex flex-col gap-3 transition-colors duration-150 border border-transparent hover:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{app.company}</p>
                      <p className="text-gray-400 text-sm">{app.position}</p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[app.status] ?? "bg-gray-700 text-gray-300"}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {app.date_applied.slice(0, 10)}
                    </span>
                  </div>

                  {app.notes && (
                    <p className="text-gray-400 text-sm">{app.notes}</p>
                  )}

                  <div className="flex gap-3 items-center">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatus(app.id, e.target.value)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded flex-1 transition-colors"
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="offer">Offer</option>
                    </select>
                    <button
                      onClick={() => handleDelete(app.id)}
                      disabled={deletingId === app.id}
                      className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 px-4 py-2 rounded text-sm transition-all active:scale-95 flex items-center gap-2"
                    >
                      {deletingId === app.id ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
