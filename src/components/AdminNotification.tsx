"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Trash2,
  Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import api from "@/lib/api";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  timestamp: string;
  installationData?: Installation;
}

interface Installation {
  id: number;
  serialNumber: string;
  userName: string;
  mobileNumber: string;
  location: string;
  date: string;
  createdAt: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await api.get("/installation");
        if (response.status !== 200) {
          throw new Error("Failed to fetch installation requests");
        }
        const data = response.data;
        const installationNotifications = data?.data?.map(
          (install: Installation) => ({
            id: install.id,
            message: `New installation request from ${install.userName} for ${install.location}`,
            type: "info" as NotificationType,
            timestamp: new Date(install.createdAt).toLocaleString(),
            installationData: install,
          })
        );
        setNotifications(installationNotifications);
      } catch (err) {
        console.error("Error fetching installations:", err);
        setError("Failed to load installation requests");
      } finally {
        setLoading(false);
      }
    };

    fetchInstallations();
  }, []);

  const deleteNotification = async (id: number) => {
    console.log(id);
    const response = await api.delete(`installation`, { data: { id } });
    console.log(response);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case "error":
        return <XCircle className="text-red-500 w-6 h-6" />;
      case "warning":
        return <AlertCircle className="text-yellow-500 w-6 h-6" />;
      case "info":
        return <Info className="text-blue-500 w-6 h-6" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // e.g., "10/25/2023, 3:45:12 PM"
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-black rounded-lg shadow-xl mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          Notifications
        </h1>
        <div className="flex items-center">
          <span className="text-gray-400 mr-4">
            {notifications.length} Notifications
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-white">
          Loading notifications...
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">{error}</div>
      ) : (
        <div className=" rounded-lg overflow-hidden shadow-lg">
          {notifications.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              No notifications available
            </div>
          ) : (
            notifications
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )
              .map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white/5 p-6 rounded-lg mb-4 hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-end justify-between">
                    <div className="flex items-start space-x-4 flex-grow">
                      {getIcon(notif.type)}{" "}
                      {/* Ensure icon has class like "text-white" */}
                      <div className="space-y-2 w-full">
                        <div className="flex justify-between w-full items-center">
                          <p className="text-gray-400">
                            ID:{" "}
                            <span className="text-white">
                              {notif?.installationData?.serialNumber}
                            </span>
                          </p>
                          <p className="text-blue-600 text-sm">
                            Created At:{" "}
                            <span className="text-white">
                              {formatDate(notif.timestamp)}
                            </span>
                          </p>
                        </div>
                        <p className="text-gray-400">
                          Client Name:{" "}
                          <span className="text-white">
                            {notif?.installationData?.userName}
                          </span>
                        </p>
                        <p className="text-gray-400">
                          Phone Number:{" "}
                          <span className="text-white">
                            {notif?.installationData?.mobileNumber}
                          </span>
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-gray-400">
                            Brand:{" "}
                            <span className="text-white">
                              {notif?.installationData?.carBrand}
                            </span>
                          </p>
                          <p className="text-gray-400">
                            Model:{" "}
                            <span className="text-white">
                              {notif?.installationData?.carModel}
                            </span>
                          </p>
                        </div>
                        <p className="text-gray-400">
                          Location:{" "}
                          <span className="text-white">
                            {notif?.installationData?.location}
                          </span>
                        </p>
                        <p className="text-green-400 text-sm">
                          Delivery Date:{" "}
                          <span className="text-white">
                            {formatDate(notif?.installationData?.date)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-gray-100 hover:text-white transition-colors duration-200"
                      variant="destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
