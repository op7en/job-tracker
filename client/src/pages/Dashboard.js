"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("../api/axios"));
const Dashboard = () => {
    const [applications, setApplications] = (0, react_1.useState)([]);
    const [company, setCompany] = (0, react_1.useState)("");
    const [position, setPosition] = (0, react_1.useState)("");
    const [notes, setNotes] = (0, react_1.useState)("");
    const handleAdd = async () => {
        await axios_1.default.post("/applications", { company, position, notes });
        const res = await axios_1.default.get("/applications");
        setApplications(res.data);
        setCompany("");
        setPosition("");
        setNotes("");
    };
    (0, react_1.useEffect)(() => {
        axios_1.default.get("/applications").then((res) => setApplications(res.data));
    }, []);
    const handleDelete = async (id) => {
        await axios_1.default.delete(`/applications/${id}`);
        setApplications(applications.filter((app) => app.id !== id));
    };
    const handleStatus = async (id, status) => {
        await axios_1.default.patch(`/applications/${id}/status`, { status });
        setApplications(applications.map((app) => (app.id === id ? { ...app, status } : app)));
    };
    return (<div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Applications</h1>

        <div className="bg-gray-800 p-6 rounded-lg mb-8 flex gap-4 flex-wrap">
          <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-gray-700 text-white p-3 rounded outline-none flex-1"/>
          <input placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} className="bg-gray-700 text-white p-3 rounded outline-none flex-1"/>
          <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-gray-700 text-white p-3 rounded outline-none flex-1"/>
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold">
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
            {applications.map((app) => (<tr key={app.id} className="border-t border-gray-700">
                <td className="p-4">{app.company}</td>
                <td className="p-4">{app.position}</td>
                <td className="p-4">{app.status}</td>
                <td className="p-4">{app.date_applied.slice(0, 10)}</td>
                <td className="p-4">
                  <select value={app.status} onChange={(e) => handleStatus(app.id, e.target.value)} className="bg-gray-700 text-white p-2 rounded">
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="offer">Offer</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(app.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
};
exports.default = Dashboard;
