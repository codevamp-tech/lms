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
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">

        {/* Header Section: Title & Revenue Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your enquiries, students, and live sessions.</p>
          </div>

          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-xl font-bold text-slate-800">{formatAmount(totalSales.toString())}</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

          {/* Controls Bar: Tabs, Search, Add Button */}
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center bg-white">

            {/* Tabs */}
            <div className="flex bg-slate-100/80 p-1 rounded-lg w-full lg:w-auto overflow-x-auto no-scrollbar">
              {[
                { label: "Chat", value: "chat" },
                { label: "Counselling", value: "counselling" },
                // { label: "Courses", value: "courses" },
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
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => setOpenForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Enquiry</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Table Container - Min height added to prevent layout shift */}
          <div className="flex-1 min-h-[400px]">
            {activeTab !== "live" ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">WhatsApp</th>
                      {activeTab === "chat" && (
                        <>
                          <th className="px-4 py-3 font-semibold">Buddy</th>
                          <th className="px-4 py-3 font-semibold">Pref. Call</th>
                        </>
                      )}

                      {activeTab === "counselling" && (
                        <th className="px-4 py-3 font-semibold">Pref. Call</th>
                      )}

                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Amount</th>
                      <th className="px-4 py-3 font-semibold text-right">Created</th>
                      {/* <th className="px-4 py-3 font-semibold text-center">Action</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentData.length > 0 ? (
                      currentData.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                            {item.name || item.nmae}
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={item.email}>
                            {item.email}
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.whatsapp}</td>


                          {activeTab === "chat" && (
                            <>
                              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item?.chatBuddyId?.name || "-"}</td>
                              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.preferredTimeToCall || "-"}</td>
                            </>
                          )}

                          {activeTab === "counselling" && (
                            <td className="px-4 py-3 text-slate-600">{item.preferredTimeToCall || "-"}</td>
                          )}

                          <td className="px-4 py-2">
                            <select
                              value={item.status}
                              onChange={(e) => updateStatus(item._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ring-1 ring-inset cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none bg-transparent ${getStatusColor(item.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="inprocess">In Process</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900 whitespace-nowrap">
                            {isClient ? formatAmount(item.amount) : "₹0"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </td>

                          {/* <td className="px-4 py-3 text-center">
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}`}
                              target="_blank"
                              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                          No enquiries found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Live Sessions View
              <div className="p-4 space-y-4 bg-slate-50/30 h-full">
                {liveSessions.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">No live sessions found</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {liveSessions.map((session) => (
                      <div key={session._id} className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
                        <div className="p-4 flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-800">{session.title}</h3>
                            <p className="text-slate-500 text-sm mt-1">
                              Price: <span className="font-medium text-slate-900">{isClient ? formatAmount(session.price?.toString()) : "₹0"}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const open = expandedSession === session._id;
                              setExpandedSession(open ? null : session._id);
                              if (!open) fetchEnrolledStudents(session._id);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${expandedSession === session._id
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              }`}
                          >
                            {expandedSession === session._id ? "Close" : "View Students"}
                          </button>
                        </div>

                        {expandedSession === session._id && (
                          <div className="bg-slate-50 border-t border-slate-100 max-h-[300px] overflow-y-auto p-3">
                            {loadingStudents === session._id ? (
                              <p className="text-xs text-center py-4 text-slate-500">Loading...</p>
                            ) : enrolledStudents[session._id]?.length ? (
                              <div className="space-y-2">
                                {enrolledStudents[session._id].map((student) => (
                                  <div key={student._id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200 shadow-sm">
                                    <div>
                                      <p className="text-sm font-medium text-slate-700">{student.name}</p>
                                      <p className="text-xs text-slate-400">{student.email}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-center py-4 text-slate-500">No students enrolled yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal/Form Overlay (Just logical placement, implementation depends on your existing code) */}
      {openForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button onClick={() => setOpenForm(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Add New Enquiry</h2>
            {/* Your Form Logic Here */}
            <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400">
              Form Content Placeholder
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
