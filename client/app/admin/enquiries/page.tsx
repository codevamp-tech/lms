"use client";

import { useEffect, useState } from "react";
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

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEnquiry();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    setEnquiries((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, status: status as any } : e
      )
    );
  };

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsappNo,
        type: formData.type,
      }),
    });

    setOpenForm(false);
    setFormData({ name: "", email: "", whatsappNo: "", type: "" });
    fetchEnquiry();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  const uniqueTypes = Array.from(new Set(enquiries.map((e) => e.type)));

  const filtered = enquiries.filter((item) => {
    const matchesSearch = (item.name || item.nmae || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = filterType
      ? item.type.toLowerCase() === filterType
      : true;

    return matchesSearch && matchesType;
  });


  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatAmount = (amount?: string) => {
    if (!amount) return "-";
    return `₹${(Number(amount) / 100).toLocaleString("en-IN")}`;
  };

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

  const TABS = [
    { label: "All", value: "" },
    { label: "Chat", value: "chat" },
    { label: "Contact", value: "contact" },
    { label: "Courses", value: "courses" },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">

          {/* Header Section */}
          <div className="  p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-blue-500 mb-2">Sales Management</h1>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          {/* Filters Section */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
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
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                />
              </div>

              {/* Tabs */}
              {/* Tabs */}
              <div className="flex gap-3 flex-wrap">
                {["All", "Chat", "Contact", "Courses"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setFilterType(tab === "All" ? "" : tab.toLowerCase());
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${filterType === tab.toLowerCase() || (tab === "All" && filterType === "")
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-blue-50"
                      }`}
                  >
                    {tab}
                  </button>
                ))}

              </div>


              {/* Add Enquiry Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setOpenForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <Plus className="w-5 h-5" />
                  Add Enquiry
                </button>
              </div>
            </div>
          </div>


          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">WhatsApp</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {currentData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{item.name || item.nmae}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{item.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">{item.whatsapp}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                    </td>
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
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{formatAmount(item.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                      >
                        <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Send Mail</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of{" "}
                  <span className="font-semibold">{filtered.length}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors font-medium text-slate-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors font-medium text-slate-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Enquiry Modal */}
      {openForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add New Enquiry</h2>
              <button
                onClick={() => setOpenForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">WhatsApp Number</Label>
                <Input
                  value={formData.whatsappNo}
                  onChange={(e) => setFormData({ ...formData, whatsappNo: e.target.value })}
                  className="border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Enquiry Type</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="border-slate-300 focus:ring-2 focus:ring-blue-500 rounded-lg"
                  placeholder="e.g., Product, Service, Support"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setOpenForm(false)}
                className="px-6 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all"
              >
                Add Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}