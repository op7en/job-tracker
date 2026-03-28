import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>

        <div className="bg-gray-800 p-6 rounded-lg mb-8 flex gap-4 flex-wrap">
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded outline-none flex-1"
          />
          <input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded outline-none flex-1"
          />
          <input
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded outline-none flex-1"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
          >
            Add
          </button>
        </div>

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
    </div>
  );
};

export default Dashboard;
