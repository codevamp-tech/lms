"use client";

import { useEffect, useState } from "react";

type Enquiry = {
  _id: string;
  name?: string;
  nmae?: string;
  email: string;
  whatsapp: string;
  type: string;
  status: string;
  price?: string;
  createdAt?: string;
};

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(""); // <-- NEW
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const res = await fetch("http://localhost:3001/enquiry");
        const data = await res.json();
        setEnquiries(data);
      } catch (error) {
        console.error("Error fetching enquiries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading...</p>;

  // Extract unique types for dropdown
  const uniqueTypes = Array.from(new Set(enquiries.map((e) => e.type)));

  // Search + Type Filter
  const filtered = enquiries.filter((item) => {
    const matchesSearch = (item.name || item.nmae || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = filterType ? item.type === filterType : true;

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">

        {/* Header + Filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Enquiries</h1>

          <div className="flex items-center gap-4">

            {/* Search */}
            <input
              type="text"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 w-64 focus:outline-none"
            />

            {/* TYPE Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              Add Enquiry
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[430px]">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">NAME</th>
                <th className="pb-3">EMAIL</th>
                <th className="pb-3">WHATSAPP</th>
                <th className="pb-3">TYPE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">PRICE</th>
                <th className="pb-3">MAIL</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr key={item._id} className="border-b h-14">
                  <td>{item.name || item.nmae || "N/A"}</td>
                  <td className="text-gray-600">{item.email}</td>
                  <td className="text-gray-600">{item.whatsapp}</td>
                  <td className="text-gray-600">{item.type}</td>

                  <td>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                      {item.status}
                    </span>
                  </td>

                  <td className="text-gray-600">{item.price || "-"}</td>

                  {/* Mail To Button */}
                  <td className="text-gray-600">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=Regarding Your Enquiry&body=Hello ${item.name || item.nmae || ""},%0A%0AWe received your enquiry and will contact you soon.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Send Email
                    </a>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border ${currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border ${currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
