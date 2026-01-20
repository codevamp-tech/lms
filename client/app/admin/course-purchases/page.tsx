"use client";

import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    Search,
    Filter,
    Shield,
    ShieldOff,
    RefreshCw,
    BookOpen,
    User,
    Check,
    X,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getAllPurchasesForAdmin,
    revokeAccess,
    restoreAccess,
} from "@/features/api/course-purchase/route";

interface Purchase {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    } | null;
    course: {
        _id: string;
        courseTitle: string;
        subTitle: string;
    } | null;
    amount: number;
    purchaseDate: string;
    expiryDate: string;
    isRevoked: boolean;
    isExpired: boolean;
    isActive: boolean;
}

export default function CoursePurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const itemsPerPage = 15;

    useEffect(() => {
        fetchPurchases();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [purchases, searchTerm, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const data = await getAllPurchasesForAdmin();
            setPurchases(data.purchases || []);
            setError("");
        } catch (err: any) {
            console.error("Error fetching purchases:", err);
            setError(err.message || "Failed to load purchases");
            setPurchases([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...purchases];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.user?.name || "").toLowerCase().includes(term) ||
                    (p.user?.email || "").toLowerCase().includes(term) ||
                    (p.course?.courseTitle || "").toLowerCase().includes(term)
            );
        }

        if (statusFilter !== "all") {
            if (statusFilter === "active") {
                filtered = filtered.filter((p) => p.isActive);
            } else if (statusFilter === "expired") {
                filtered = filtered.filter((p) => p.isExpired && !p.isRevoked);
            } else if (statusFilter === "revoked") {
                filtered = filtered.filter((p) => p.isRevoked);
            }
        }

        setFilteredPurchases(filtered);
    };

    const handleRevoke = async (purchaseId: string) => {


        try {
            setActionLoading(purchaseId);
            await revokeAccess(purchaseId);
            toast.success("Access revoked successfully");
            fetchPurchases();
        } catch (err: any) {
            toast.error(err.message || "Failed to revoke access");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (purchaseId: string) => {
        try {
            setActionLoading(purchaseId);
            await restoreAccess(purchaseId);
            toast.success("Access restored successfully");
            fetchPurchases();
        } catch (err: any) {
            toast.error(err.message || "Failed to restore access");
        } finally {
            setActionLoading(null);
        }
    };

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
    const paginatedPurchases = filteredPurchases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (purchase: Purchase) => {
        const baseClass =
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase";

        if (purchase.isRevoked) {
            return (
                <span className={`${baseClass} bg-rose-50 text-rose-700 border border-rose-200`}>
                    <ShieldOff className="w-3.5 h-3.5" /> Revoked
                </span>
            );
        }

        if (purchase.isExpired) {
            return (
                <span className={`${baseClass} bg-amber-50 text-amber-700 border border-amber-200`}>
                    <AlertTriangle className="w-3.5 h-3.5" /> Expired
                </span>
            );
        }

        return (
            <span className={`${baseClass} bg-emerald-50 text-emerald-700 border border-emerald-200`}>
                <Check className="w-3.5 h-3.5" /> Active
            </span>
        );
    };

    const stats = {
        total: purchases.length,
        active: purchases.filter((p) => p.isActive).length,
        expired: purchases.filter((p) => p.isExpired && !p.isRevoked).length,
        revoked: purchases.filter((p) => p.isRevoked).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                Course Purchases
                            </h1>
                            <p className="text-slate-600 text-base sm:text-lg">
                                Manage course access and validity
                            </p>
                        </div>

                        <button
                            onClick={fetchPurchases}
                            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-all flex items-center gap-2 font-semibold text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                            <div className="text-sm text-slate-600">Total Purchases</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
                            <div className="text-2xl font-bold text-emerald-700">{stats.active}</div>
                            <div className="text-sm text-emerald-600">Active</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-sm">
                            <div className="text-2xl font-bold text-amber-700">{stats.expired}</div>
                            <div className="text-sm text-amber-600">Expired</div>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 shadow-sm">
                            <div className="text-2xl font-bold text-rose-700">{stats.revoked}</div>
                            <div className="text-sm text-rose-600">Revoked</div>
                        </div>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Filter Purchases</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by user or course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="revoked">Revoked</option>
                                </select>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                }}
                                className="px-3 py-2.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold border-2 border-slate-200"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-rose-50 border-2 border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        <span className="font-medium text-sm">{error}</span>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-48 bg-white/80 rounded-xl shadow-lg border border-slate-200/50">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200"></div>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 absolute inset-0"></div>
                        </div>
                        <p className="mt-3 text-slate-600 font-medium text-sm">Loading purchases...</p>
                    </div>
                )}

                {/* Table */}
                {!loading && filteredPurchases.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            User
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Course
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Purchase Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Expiry Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedPurchases.map((purchase) => (
                                        <tr key={purchase._id} className="hover:bg-blue-50/50 transition-all">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-slate-900">
                                                            {purchase.user?.name || "Unknown"}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {purchase.user?.email || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-slate-900 max-w-[200px] truncate">
                                                            {purchase.course?.courseTitle || "Unknown Course"}
                                                        </div>
                                                        <div className="text-xs text-slate-500 max-w-[200px] truncate">
                                                            {purchase.course?.subTitle || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-slate-900">₹{purchase.amount}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(purchase.purchaseDate)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(purchase.expiryDate)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(purchase)}</td>
                                            <td className="px-4 py-3">
                                                {purchase.isRevoked ? (
                                                    <button
                                                        onClick={() => handleRestore(purchase._id)}
                                                        disabled={actionLoading === purchase._id}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        <Shield className="w-3.5 h-3.5" />
                                                        {actionLoading === purchase._id ? "..." : "Restore"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRevoke(purchase._id)}
                                                        disabled={actionLoading === purchase._id}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                    >
                                                        <ShieldOff className="w-3.5 h-3.5" />
                                                        {actionLoading === purchase._id ? "..." : "Revoke"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 gap-3">
                            <div className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
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
                {!loading && filteredPurchases.length === 0 && (
                    <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg border border-slate-200/50">
                        <div className="inline-flex p-5 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full mb-4">
                            <BookOpen className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {purchases.length === 0 ? "No purchases yet" : "No purchases match your filters"}
                        </h3>
                        <p className="text-slate-600 mb-6 text-base">
                            {purchases.length === 0
                                ? "Purchases will appear here once users enroll in courses"
                                : "Try adjusting your filters"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
