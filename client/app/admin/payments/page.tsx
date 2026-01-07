"use client";

import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Mail,
    Phone,
    DollarSign,
    Check,
    X,
    Clock,
    Search,
    Filter,
    IndianRupee,
} from "lucide-react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Payment {
    id: string;
    amount: number;
    status: string;
    email: string;
    contact: string;
    method: string;
    created_at: number;
    description: string;
    fee: number;
    amount_refunded: number;
    captured: boolean;
    error_description?: string;
}

export default function PaymentPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [isCapturedOnly, setIsCapturedOnly] = useState(true);
    const [isFetchAll, setIsFetchAll] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(false);

    const itemsPerPage = 5;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        fetchPayments({ page: 1, limit: itemsPerPage, captured: isCapturedOnly, fetchAll: isFetchAll });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCapturedOnly, isFetchAll]);

    // include isCapturedOnly so filters re-run when toggle changes
    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payments, searchTerm, statusFilter, methodFilter, isCapturedOnly]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, methodFilter]);

    const fetchPayments = async ({
        page = 1,
        limit = itemsPerPage,
        captured = false,
        fetchAll = false,
    }: {
        page?: number;
        limit?: number;
        captured?: boolean;
        fetchAll?: boolean;
    } = {}) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (fetchAll) {
                params.set("fetchAll", "true");
            } else {
                params.set("page", String(page));
                params.set("limit", String(limit));
            }
            const base = API_URL + (captured ? "/razorpay/captured-payments" : "/razorpay/payments");
            const res = await fetch(`${base}?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch payments");
            const data = await res.json();
            const items: Payment[] = data.items || [];
            setPayments(items);
            setHasNextPage(!fetchAll && items.length >= limit);
            setError("");
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError("Failed to load payments");
            setPayments([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...payments];

        // enforce server-side captured-only as safety
        if (isCapturedOnly) {
            filtered = filtered.filter((p) => p.status === "captured");
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.email || "").toLowerCase().includes(term) ||
                    (p.contact || "").includes(term) ||
                    (p.id || "").toLowerCase().includes(term) ||
                    (p.description || "").toLowerCase().includes(term)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }

        if (methodFilter !== "all") {
            filtered = filtered.filter((p) => p.method === methodFilter);
        }

        setFilteredPayments(filtered);
    };

    const payNow = async () => {
        try {
            const res = await fetch("http://localhost:3000/payment/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 500 }),
            });
            const order = await res.json();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "My Company",
                description: "Test Payment",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("http://localhost:3000/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const result = await verifyRes.json();
                    alert(result.success ? "✅ Payment Successful" : "❌ Payment Failed");
                    if (result.success) {
                        fetchPayments({ page: currentPage, limit: itemsPerPage, captured: isCapturedOnly, fetchAll: isFetchAll });
                    }
                },
                prefill: { name: "Shoaib Khan", email: "test@example.com", contact: "9999999999" },
                theme: { color: "#2563eb" },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    const handleNextPage = () => {
        if (isFetchAll || !hasNextPage) return;
        const next = currentPage + 1;
        fetchPayments({ page: next, limit: itemsPerPage, captured: isCapturedOnly, fetchAll: false });
        setCurrentPage(next);
    };

    const handlePrevPage = () => {
        if (isFetchAll || currentPage <= 1) return;
        const prev = currentPage - 1;
        fetchPayments({ page: prev, limit: itemsPerPage, captured: isCapturedOnly, fetchAll: false });
        setCurrentPage(prev);
    };
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const paginatedPayments = isFetchAll
        ? filteredPayments.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
        : filteredPayments;


    const formatCurrency = (amount: number) => `₹${(amount / 100).toFixed(2)}`;

    const formatDate = (timestamp: number) =>
        new Date(timestamp * 1000).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const getStatusBadge = (status: string) => {
        const baseClass = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200";
        switch (status) {
            case "captured":
                return (
                    <span className={`${baseClass} bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm`}>
                        <Check className="w-3.5 h-3.5" /> Captured
                    </span>
                );
            case "failed":
                return (
                    <span className={`${baseClass} bg-rose-50 text-rose-700 border border-rose-200 shadow-sm`}>
                        <X className="w-3.5 h-3.5" /> Failed
                    </span>
                );
            case "pending":
                return (
                    <span className={`${baseClass} bg-amber-50 text-amber-700 border border-amber-200 shadow-sm`}>
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
            default:
                return <span className={`${baseClass} bg-slate-50 text-slate-700 border border-slate-200 shadow-sm`}>{status}</span>;
        }
    };

    const uniqueStatuses = Array.from(new Set(payments.map((p) => p.status)));
    const uniqueMethods = Array.from(new Set(payments.map((p) => p.method)));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                Payment Dashboard
                            </h1>
                            <p className="text-slate-600 text-base sm:text-lg">Track and manage all your transactions</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* <button
                onClick={() => {
                  const next = !isCapturedOnly;
                  setIsCapturedOnly(next);
                  setCurrentPage(1);
                  setTimeout(() => fetchPayments({ page: 1, limit: itemsPerPage, captured: next, fetchAll: isFetchAll }), 0);
                }}
                className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isCapturedOnly 
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40" 
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isCapturedOnly && <Check className="w-4 h-4" />}
                  {isCapturedOnly ? "Captured Only" : "All Payments"}
                </span>
              </button> */}

                            {/* <button
                onClick={() => {
                  const next = !isFetchAll;
                  setIsFetchAll(next);
                  setCurrentPage(1);
                  setTimeout(() => fetchPayments({ page: 1, limit: itemsPerPage, captured: isCapturedOnly, fetchAll: next }), 0);
                }}
                className={`relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isFetchAll 
                    ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/40" 
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {isFetchAll ? "Fetching All" : "Fetch All"}
              </button> */}

                            {/* <button 
                onClick={payNow} 
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-semibold text-sm transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  New Payment
                </span>
              </button> */}
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Filter Transactions</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg appearance-none bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-medium text-slate-700 cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    {uniqueStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronRight className="w-4 h-4 text-slate-400 -rotate-90" />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    value={methodFilter}
                                    onChange={(e) => setMethodFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg appearance-none bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 font-medium text-slate-700 cursor-pointer"
                                >
                                    <option value="all">All Methods</option>
                                    {uniqueMethods.map((method) => (
                                        <option key={method} value={method}>
                                            {method.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronRight className="w-4 h-4 text-slate-400 -rotate-90" />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setMethodFilter("all");
                                }}
                                className="px-3 py-2.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition-all duration-200 font-semibold border-2 border-slate-200 hover:border-slate-300 active:scale-95"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-200 rounded-lg text-rose-700 flex items-center gap-2 shadow-md">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-48 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 absolute inset-0"></div>
                        </div>
                        <p className="mt-3 text-slate-600 font-medium text-sm">Loading payments...</p>
                    </div>
                )}

                {/* Payments Table */}
                {!loading && filteredPayments.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Payment ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Method</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedPayments.map((payment, index) => (

                                        <tr
                                            key={payment.id}
                                            className="hover:bg-blue-50/50 transition-all duration-200 group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200 group-hover:border-blue-200 transition-colors">
                                                    {payment.id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                                                        <div className="p-1 bg-blue-50 rounded group-hover:bg-blue-100 transition-colors">
                                                            <Mail className="w-3 h-3 text-blue-600" />
                                                        </div>
                                                        {payment.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <div className="p-1 bg-slate-50 rounded group-hover:bg-slate-100 transition-colors">
                                                            <Phone className="w-3 h-3 text-slate-500" />
                                                        </div>
                                                        {payment.contact}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="p-1.5 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-base">{formatCurrency(payment.amount)}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 capitalize shadow-sm">
                                                    {payment.method}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-slate-700 truncate max-w-[180px] font-medium">{payment.description}</p>
                                                {payment.status === "failed" && payment.error_description && (
                                                    <p className="text-xs text-rose-600 mt-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 inline-block">
                                                        {payment.error_description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <div className="p-1 bg-slate-50 rounded group-hover:bg-slate-100 transition-colors">
                                                        <Calendar className="w-3 h-3 text-slate-500" />
                                                    </div>
                                                    <span className="font-medium">{formatDate(payment.created_at)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 gap-3">
                            <div className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                Page {currentPage} of {totalPages || 1}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-lg transition-all disabled:opacity-40 bg-white border-2 border-slate-200"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage >= totalPages}
                                    className="p-2.5 rounded-lg transition-all disabled:opacity-40 bg-white border-2 border-slate-200"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredPayments.length === 0 && (
                    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
                        <div className="inline-flex p-5 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full mb-4">
                            <DollarSign className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {payments.length === 0 ? "No payments yet" : "No payments match your filters"}
                        </h3>
                        <p className="text-slate-600 mb-6 text-base">
                            {payments.length === 0 ? "Start by creating a new payment" : "Try adjusting your filters"}
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setMethodFilter("all");
                            }}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-semibold text-sm transform hover:scale-105 active:scale-95"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}