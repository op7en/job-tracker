import { useState, useEffect } from "react";
import api from "../api/axios";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  notes: string;
}

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = async () => {
    await api.post("/applications", { company, position, notes });
    const res = await api.get("/applications");
    setApplications(res.data);
    setCompany("");
    setPosition("");
    setNotes("");
  };

  useEffect(() => {
    api.get("/applications").then((res) => setApplications(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    await api.delete(`/applications/${id}`);
    setApplications(applications.filter((app) => app.id !== id));
  };

  const handleStatus = async (id: number, status: string) => {
    await api.patch(`/applications/${id}/status`, { status });
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status } : app)),
    );
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
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1"
          />
          <input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1"
          />
          <input
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded outline-none w-full md:flex-1"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold w-full md:w-auto"
          >
            Add
          </button>
        </div>

        {/* Десктоп: таблица */}
        <div className="hidden md:block">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Position</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date Applied</th>
                <th className="p-4 text-left">Update</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t border-gray-700">
                  <td className="p-4">{app.company}</td>
                  <td className="p-4">{app.position}</td>
                  <td className="p-4">{app.status}</td>
                  <td className="p-4">{app.date_applied.slice(0, 10)}</td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatus(app.id, e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded"
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
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Мобайл: карточки */}
        <div className="flex flex-col gap-4 md:hidden">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-gray-800 rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{app.company}</p>
                  <p className="text-gray-400 text-sm">{app.position}</p>
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
                  className="bg-gray-700 text-white p-2 rounded flex-1"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="offer">Offer</option>
                </select>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
                >
                  Delete
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
