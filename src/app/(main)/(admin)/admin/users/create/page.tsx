"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";

const ManageAdminsPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [showpass, setShowpass] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const router = useRouter();

  // Fetch current user and admin list
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user info
        const userResponse = await api.get("/auth/me");
        console.log(userResponse);
        setCurrentUser(userResponse.data.user);

        // if (
        //   userResponse.data.user?.role !== "ADMIN" ||
        //   userResponse.data.user?.role !== "SUPER_ADMIN"
        // ) {
        //   toast.error("You don't have permission to access this page");
        //   router.push("/");
        //   return;
        // }

        // Get admin list
        const adminsResponse = await api.get("/admin");
        setAdmins(adminsResponse.data.admins);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/admin", formData);

      toast.success("Admin user created successfully");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ADMIN",
      });

      router.push("/admin/users/");

      // // Refresh admin list
      // const updatedAdmins = await api.get("/admin");
      // setAdmins(updatedAdmins.data.admins);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create admin user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId: number, newStatus: string) => {
    try {
      await api.put("/admin", {
        id: userId,
        status: newStatus,
      });

      toast.success("User status updated successfully");

      // Refresh admin list
      const updatedAdmins = await api.get("/admin");
      setAdmins(updatedAdmins.data.admins);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      // Prevent self-demotion
      if (currentUser?.id === userId && newRole !== "ADMIN") {
        toast.error("You cannot demote your own admin account");
        return;
      }

      await api.put("/admin", {
        id: userId,
        role: newRole,
      });

      toast.success("User role updated successfully");

      // Refresh admin list
      const updatedAdmins = await api.get("/admin");
      setAdmins(updatedAdmins.data.admins);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update user role");
    }
  };

  if (loadingAdmins) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Admin Users</h1>

      <div className="grid grid-cols-1  gap-8">
        <div className="bg-black border border-zinc-800 rounded-lg p-6 shadow-lg max-w-screen-sm mx-auto w-full">
          <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showpass}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="absolute top-[6px] right-2 cursor-pointer">
                  {showpass === "text" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      onClick={() => setShowpass("password")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      onClick={() => setShowpass("text")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </form>
        </div>

        {/* <div className="bg-black border border-zinc-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Existing Admin Users</h2>

          {admins.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin: any) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        {admin.firstName} {admin.lastName}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Select
                          value={admin.role}
                          onValueChange={(newRole) =>
                            handleUpdateUserRole(admin.id, newRole)
                          }
                          disabled={currentUser?.id === admin.id}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            admin.status === "ACTIVE"
                              ? "default"
                              : "destructive"
                          }
                          className=" py-2"
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={admin.status}
                          onValueChange={(newStatus) =>
                            handleUpdateUserStatus(admin.id, newStatus)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Activate</SelectItem>
                            <SelectItem value="INACTIVE">Deactivate</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">No admin users found</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ManageAdminsPage;
