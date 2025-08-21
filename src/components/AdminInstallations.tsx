"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use next/navigation for App Router
import Link from "next/link";
import { Info, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Installation {
  carModelYear: React.ReactNode;
  id: number;
  serialNumber: string;
  userName: string;
  mobileNumber: string;
  alternateNumber: string | null;
  location: string;
  category: string;
  city: string;
  pincode: string;
  productSlugs: string[];
  state: string;
  carBrand: string;
  carModel: string;
  referredDate: string;
  specialInstructions: string;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  installations: Installation[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  searchQuery: string;
  status: string;
  error?: string;
}

const AdminInstallations = ({
  installations,
  meta,
  searchQuery,
  status,
  error,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters in a client component
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Create a new URLSearchParams object with existing params
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      // Construct the correct pathname based on status
      const basePath =
        status === "all"
          ? "/admin/home-installation"
          : `/admin/home-installation/${status}`;
      router.push(`${basePath}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, router, status, searchParams]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put("installation", { id, status: newStatus });
      router.refresh(); // Refresh the page to reflect the updated data
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteInstallation = async (id: number) => {
    try {
      await api.delete("installation", { data: { id } });
      router.refresh();
    } catch (err) {
      console.error("Error deleting installation:", err);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    // Skip highlighting if query matches a status (e.g., "CANCELLED")
    const validStatuses = ["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (validStatuses.includes(query.toUpperCase())) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <Badge className="bg-blue-500">Requested</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge className="bg-purple-500">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const title =
    status === "all"
      ? "All "
      : `${status.charAt(0).toUpperCase() + status.slice(1)} `;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-black rounded-lg shadow-xl mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          {title}Home Installation Requests
        </h1>
        <div className="flex items-center">
          <span className="text-gray-400 mr-4">
            {installations.length} Requests
          </span>
        </div>
      </div>

      {status === "all" && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, mobile number, or status (e.g., CANCELLED)"
          className="mb-8 p-2 w-full rounded bg-gray-800 text-white"
        />
      )}

      {error ? (
        <div className="text-center p-8 text-red-500">{error}</div>
      ) : installations.length === 0 ? (
        <div className="text-center p-8 text-gray-400">No data found</div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {installations.map((installation) => (
            <AccordionItem
              key={installation.id}
              value={`item-${installation.id}`}
              className="bg-white/5 rounded-lg mb-4 hover:bg-white/10 transition-colors duration-200 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex flex-col w-full">
                  <div className="flex justify-between w-full text-lg items-center">
                    <div className="flex items-center gap-4">
                      <Info className="text-blue-500 w-6 h-6" />
                      <p className="text-white font-medium">
                        {highlightText(installation.userName, search)} |{" "}
                        {installation.city}, {installation.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pr-4">
                      {getStatusBadge(installation.status)}
                      <p className="text-gray-400 text-sm">
                        {formatDate(installation.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-base">
                  <div className="space-y-4">
                    <p>
                      <span className="text-gray-400">ID: </span>
                      {installation.serialNumber}
                    </p>
                    <p>
                      <span className="text-gray-400">Client Name: </span>
                      {highlightText(installation.userName, search)}
                    </p>
                    <p>
                      <span className="text-gray-400">Phone Number: </span>
                      {highlightText(installation.mobileNumber, search)}
                    </p>
                    {installation.alternateNumber && (
                      <p>
                        <span className="text-gray-400">
                          Alternate Number:{" "}
                        </span>
                        {installation.alternateNumber}
                      </p>
                    )}
                    <p>
                      <span className="text-gray-400">Car Brand: </span>
                      {installation.carBrand}
                    </p>
                    <p>
                      <span className="text-gray-400">Car Model: </span>
                      {installation.carModel}
                    </p>
                    <p>
                      <span className="text-gray-400">Car Model Year: </span>
                      {installation.carModelYear}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p>
                      <span className="text-gray-400">Full Address: </span>
                      {installation.location}
                    </p>
                    <p>
                      <span className="text-gray-400">City: </span>
                      {installation.city}, {installation.state} -{" "}
                      {installation.pincode}
                    </p>
                    <p>
                      <span className="text-gray-400">Installation Date: </span>
                      {formatDate(installation.date)}
                    </p>
                    <p>
                      <span className="text-gray-400">Referred Date: </span>
                      {formatDate(installation.referredDate)}
                    </p>
                    <div className="bg-black p-4 rounded-xl">
                      <p>
                        <span className="text-gray-400 text-lg font-bold">
                          Requested Car Part:
                        </span>
                      </p>
                      {Object.entries(installation.productSlugs).map(
                        ([category, slugs]) => (
                          <div key={category} className="ml-2">
                            <p className="font-semibold">{category}:</p>
                            <ul className="list-disc list-inside">
                              {slugs.map((slug) => (
                                <li key={slug}>{slug}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                    <p>
                      <span className="text-gray-400">
                        Special Instructions:{" "}
                      </span>
                      {installation.specialInstructions}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  {status === "all" && (
                    <select
                      value={installation.status}
                      onChange={(e) =>
                        handleStatusChange(installation.id, e.target.value)
                      }
                      className="p-2 bg-gray-800 text-white rounded"
                    >
                      <option value="REQUESTED">Requested</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  )}
                  <Button
                    onClick={() => deleteInstallation(installation.id)}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Request
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {installations.length > 0 && (
        <div className="flex justify-center mt-4 gap-4">
          {meta.page > 1 && (
            <Link
              href={{
                pathname:
                  status === "all"
                    ? "/admin/home-installation"
                    : `/admin/home-installation/${status}`,
                query: { q: search, page: meta.page - 1 },
              }}
            >
              <Button>Previous</Button>
            </Link>
          )}
          <span className="text-white">
            Page {meta.page} of {meta.totalPages}
          </span>
          {meta.page < meta.totalPages && (
            <Link
              href={{
                pathname:
                  status === "all"
                    ? "/admin/home-installation"
                    : `/admin/home-installation/${status}`,
                query: { q: search, page: meta.page + 1 },
              }}
            >
              <Button>Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInstallations;
