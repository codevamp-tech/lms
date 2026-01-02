"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

type Enquiry = {
    _id: string;
    name?: string;
    nmae?: string;
    email: string;
    whatsapp: string;
    type: string;
    status: "pending" | "inprocess" | "done";
    createdAt?: string;
};

export default function ContactEnquiryPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchContactEnquiries();
    }, []);

    const fetchContactEnquiries = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`);
            const data: Enquiry[] = await res.json();

            // ✅ sirf contact enquiries
            const contactOnly = data.filter(
                (e) => e.type?.toLowerCase() === "contact"
            );

            setEnquiries(contactOnly);
        } catch (err) {
            console.error("Error fetching contact enquiries", err);
        } finally {
            setLoading(false);
        }
    };


    const updateStatus = async (id: string, status: "pending" | "inprocess" | "done") => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            // update local state (no reload)
            setEnquiries((prev) =>
                prev.map((e) =>
                    e._id === id ? { ...e, status } : e
                )
            );
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const filtered = enquiries.filter((item) =>
        (item.name || item.nmae || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "done":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    icon: CheckCircle,
                    label: "Completed"
                };
            case "inprocess":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-700",
                    icon: Clock,
                    label: "In Progress"
                };
            default:
                return {
                    bg: "bg-amber-100",
                    text: "text-amber-700",
                    icon: AlertCircle,
                    label: "Pending"
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading enquiries...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Contact Enquiries
                                </h1>
                                <p className="text-blue-100">
                                    Manage and track all contact form submissions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 border-b">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-medium">Pending</p>
                                    <p className="text-2xl font-bold text-slate-700">
                                        {enquiries.filter(e => e.status === "pending").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-medium">In Progress</p>
                                    <p className="text-2xl font-bold text-slate-700">
                                        {enquiries.filter(e => e.status === "inprocess").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-medium">Completed</p>
                                    <p className="text-2xl font-bold text-slate-700">
                                        {enquiries.filter(e => e.status === "done").length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-y border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        WhatsApp
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-slate-100 p-4 rounded-full">
                                                    <Search className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No contact enquiries found</p>
                                                <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {filtered.map((item) => {
                                    const statusConfig = getStatusConfig(item.status);
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-blue-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">
                                                    {item.name || item.nmae}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 text-sm">
                                                    {item.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-600 text-sm font-mono">
                                                    {item.whatsapp}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        updateStatus(item._id, e.target.value as "pending" | "inprocess" | "done")
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all
    ${item.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                            item.status === "inprocess" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                                "bg-green-100 text-green-700 border-green-200"
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="inprocess">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>

                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    Send Email
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <p className="text-sm text-slate-500 text-center">
                            Showing <span className="font-medium text-slate-700">{filtered.length}</span> of{" "}
                            <span className="font-medium text-slate-700">{enquiries.length}</span> enquiries
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}