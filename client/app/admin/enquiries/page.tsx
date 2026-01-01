"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Mail, X } from "lucide-react";

type Enquiry = {
  _id: string;
  name?: string;
  nmae?: string;
  email: string;
  whatsapp: string;
  type: string;
  status: "pending" | "inprocess" | "done";
  amount?: string;
  createdAt?: string;
};

type LiveSession = {
  _id: string;
  title: string;
  price?: string | number;
};

type EnrolledStudent = {
  _id: string;
  name: string;
  email: string;
  amount?: string;
};

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "chat" | "counselling" | "courses" | "live" | undefined>();
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Record<string, EnrolledStudent[]>>({});
  const [loadingStudents, setLoadingStudents] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNo: "",
    type: "",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActiveTab("chat"); // default tab
    setFilterType("chat"); // show only chat enquiries
    fetchEnquiry();
  }, []);


  const fetchEnquiry = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`);
      const data = await res.json();
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/live-session`);
      const data = await res.json();
      setLiveSessions(data);
    } catch (err) {
      console.error("Error fetching live sessions", err);
    }
  };

  const fetchEnrolledStudents = async (sessionId: string) => {
    if (enrolledStudents[sessionId]) return; // cache
    setLoadingStudents(sessionId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/live-session/${sessionId}/enrolled-students`);
      const data = await res.json();
      setEnrolledStudents((prev) => ({
        ...prev,
        [sessionId]: data.students || [],
      }));
    } catch (err) {
      console.error("Error fetching students", err);
    } finally {
      setLoadingStudents(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, status: status as any } : e)));
  };

  const filtered = enquiries.filter((item) => {
    const matchesSearch = (item.name || item.nmae || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? item.type.toLowerCase() === filterType : true;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "inprocess":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "done":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const totalSales = useMemo(() => {
    if (!isClient) return 0;

    let total = 0;

    if (activeTab === "live") {
      liveSessions.forEach((session) => {
        const students = enrolledStudents[session._id] || [];
        const price = Number(session.price ?? 0);
        total += students.length * price;
      });
    } else {
      filtered.forEach((e) => {
        total += Number(e.amount ?? 0);
      });
    }

    return total;
  }, [activeTab, filtered, liveSessions, enrolledStudents, isClient]);

  const formatAmount = (amount?: string) => {
    if (!amount) return "₹0";
    if (!isClient) return "₹0";
    return Number(amount).toLocaleString("en-IN", { style: "currency", currency: "INR" });
  };

  if (loading || !activeTab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">

          {/* Header */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-blue-500 mb-2">Sales Management</h1>
          </div>

          {/* Filters */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200 space-y-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Chat", value: "chat" },
                { label: "Counselling", value: "counselling" },
                { label: "Courses", value: "courses" },
                { label: "Live Session", value: "live" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value as any);
                    setCurrentPage(1);
                    if (tab.value === "live") fetchLiveSessions();
                    else setFilterType(tab.value === "all" ? "" : tab.value);
                  }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${activeTab === tab.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-blue-50"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Enquiry Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setOpenForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" /> Add Enquiry
              </button>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center rounded-b-xl">
            <h2 className="text-lg font-semibold text-slate-700">Total Revenue</h2>
            <span className="text-xl font-bold text-green-600">
              {formatAmount(totalSales.toString())}
            </span>
          </div>

          {/* Enquiry Table */}
          {activeTab !== "live" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">WhatsApp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">{item.name || item.nmae}</td>
                      <td className="px-6 py-4">{item.email}</td>
                      <td className="px-6 py-4">{item.whatsapp}</td>
                      <td className="px-6 py-4">{item.type}</td>
                      <td className="px-6 py-4">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item._id, e.target.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all ${getStatusColor(item.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="inprocess">In Process</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">{isClient ? formatAmount(item.amount) : "₹0"}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Mail className="w-4 h-4 inline-block mr-1" />
                          Send Mail
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Live Sessions */}
          {activeTab === "live" && isClient && (
            <div className="p-6 space-y-4">
              {liveSessions.length === 0 ? (
                <p className="text-slate-500">No live sessions found</p>
              ) : (
                liveSessions.map((session) => (
                  <div key={session._id} className="border rounded-xl bg-white shadow-sm">
                    <button
                      onClick={() => {
                        const open = expandedSession === session._id;
                        setExpandedSession(open ? null : session._id);
                        if (!open) fetchEnrolledStudents(session._id);
                      }}
                      className="w-full flex justify-between items-center p-4 font-semibold text-slate-800"
                    >
                      <div className="flex flex-col">
                        <span>{session.title}</span>
                        <span>Price: {isClient ? formatAmount(session.price?.toString()) : "₹0"}</span>
                      </div>
                      <span>{expandedSession === session._id ? "−" : "+"}</span>
                    </button>
                    {expandedSession === session._id && (
                      <div className="p-4 border-t bg-slate-50">
                        {loadingStudents === session._id ? (
                          <p className="text-sm text-slate-500">Loading students...</p>
                        ) : enrolledStudents[session._id]?.length ? (
                          <ul>
                            {enrolledStudents[session._id].map((student) => (
                              <li key={student._id} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-xs text-slate-500">{student.email}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500">No students enrolled</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border bg-white text-slate-700 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg border ${currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border bg-white text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
