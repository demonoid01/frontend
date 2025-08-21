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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Edit2Icon, PackageOpenIcon, RefreshCw, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
const ManageUsersPage = () => {
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
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  // Fetch current user and all users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/auth/me");
        setCurrentUser(userResponse.data.user);
        console.log(userResponse);

        // if (
        //   userResponse.data.user?.role !== "ADMIN" ||
        //   userResponse.data.user?.role !== "SUPER_ADMIN"
        // ) {
        //   toast.error("You don't have permission to access this page");
        //   router.push("/");
        //   return;
        // }

        const usersResponse = await api.get("/auth/users");
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, [router]);

  // Handle form input changes for creating a new user
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle role selection for new user
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  // Submit form to create a new user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/users", formData);
      toast.success("User created successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ADMIN",
      });
      const updatedUsers = await api.get("/auth/users");
      setUsers(updatedUsers.data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a user's role from the table dropdown
  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    if (currentUser?.id === userId && newRole !== "ADMIN") {
      toast.error("You cannot demote your own admin account");
      return;
    }
    try {
      await api.put("/auth/users", { id: userId, role: newRole });
      toast.success("Role updated successfully");
      const updatedUsers = await api.get("/auth/users");
      setUsers(updatedUsers.data);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  // Update a user's status from the table dropdown
  const handleUpdateUserStatus = async (userId: number, newStatus: string) => {
    try {
      await api.put("/auth/users", { id: userId, status: newStatus });
      toast.success("Status updated successfully");
      const updatedUsers = await api.get("/auth/users");
      setUsers(updatedUsers.data);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Handle form submission for editing a user
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editUser.id === currentUser.id && editUser.role !== "ADMIN") {
      toast.error("You cannot demote your own admin account");
      return;
    }
    try {
      const updateData = { ...editUser };
      if (newPassword) {
        updateData.password = newPassword;
      }
      await api.put("/auth/users", updateData);
      toast.success("User updated successfully");
      setEditUser(null);
      setNewPassword("");
      const updatedUsers = await api.get("/auth/users");
      setUsers(updatedUsers.data);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (deleteUserId === currentUser.id) {
      toast.error("You cannot delete your own account");
      setDeleteUserId(null);
      return;
    }
    try {
      await api.delete("/auth/users", { data: { id: deleteUserId } });
      toast.success("User deleted successfully");
      setDeleteUserId(null);
      const updatedUsers = await api.get("/auth/users");
      setUsers(updatedUsers.data);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Loading state
  if (loadingUsers) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center pb-10">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Drawer direction="right">
          <DrawerTrigger>
            <Button>Create new user</Button>
          </DrawerTrigger>
          <DrawerContent className="bg-black max-w-[600px] w-full h-full overflow-y-scroll overflow-x-hidden">
            <DrawerHeader className="p-4 my-4">
              <DrawerTitle className="text-3xl text-center">
                Create New User
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </Label>
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
                  <Label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </Label>
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
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </Label>
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
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </Label>
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
                    <div className="absolute top-[10px] right-2 cursor-pointer">
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
                  <Label
                    htmlFor="role"
                    className="block text-sm font-medium mb-1"
                  >
                    User Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="h-12">
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
                  className="w-full text-white bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 rounded-full border-t-2 border-r-2 border-white animate-spin"></div>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Create New User Form */}

        {/* Existing Users Table */}
        <div className="bg-black border border-zinc-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(newRole) =>
                            handleUpdateUserRole(user.id, newRole)
                          }
                          disabled={currentUser?.id === user.id}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.status}
                          onValueChange={(newStatus) =>
                            handleUpdateUserStatus(user.id, newStatus)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setViewUser(user)}
                          className="bg-black text-white"
                        >
                          <PackageOpenIcon />
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => setEditUser(user)}
                          className="bg-blue-600/70 text-white"
                        >
                          <Edit2Icon />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </div>
      </div>

      {/* View User Modal */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {viewUser.id}
              </p>
              <p>
                <strong>Username:</strong> {viewUser.username}
              </p>
              <p>
                <strong>First Name:</strong> {viewUser.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {viewUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {viewUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {viewUser.phone || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {viewUser.role}
              </p>
              <p>
                <strong>Status:</strong> {viewUser.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(viewUser.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(viewUser.updatedAt).toLocaleString()}
              </p>
              {viewUser.image && (
                <p>
                  <strong>Image URL:</strong> {viewUser.image}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label className="block text-sm font-medium">Username</Label>
                <Input
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">First Name</Label>
                <Input
                  value={editUser.firstName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Last Name</Label>
                <Input
                  value={editUser.lastName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Phone</Label>
                <Input
                  value={editUser.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="block text-sm font-medium">Role</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) =>
                    setEditUser({ ...editUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium">Status</Label>
                <Select
                  value={editUser.status}
                  onValueChange={(value) =>
                    setEditUser({ ...editUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium">
                  New Password (optional)
                </Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent className="bg-black">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setDeleteUserId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsersPage;
