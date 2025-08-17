"use client";
import React, { useState } from "react";
import { useContextData } from "@/ContextData/ContextDatastore";
import Loader from "@/components/MicroComponents/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { User, Phone, Mail } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

const AddressForm = ({ address, onSave, onCancel }) => {
  const initialValues = address || {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  };

  const validationSchema = Yup.object({
    addressLine1: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    postalCode: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      if (address) {
        await api.put(`/user/addresses/${address.id}`, values);
        toast.success("Address updated");
      } else {
        await api.post("/user/addresses", values);
        toast.success("Address added");
        setTimeout(() => onSave(), 500); // Delay to show toast
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched }) => (
        <Form className="space-y-4 p-4">
          <div>
            <Label>Address Line 1</Label>
            <Field name="addressLine1" as={Input} />
            {touched.addressLine1 && errors.addressLine1 && (
              <div className="text-red-500 text-sm">{errors.addressLine1}</div>
            )}
          </div>
          <div>
            <Label>Address Line 2</Label>
            <Field name="addressLine2" as={Input} />
          </div>
          <div>
            <Label>City</Label>
            <Field name="city" as={Input} />
            {touched.city && errors.city && (
              <div className="text-red-500 text-sm">{errors.city}</div>
            )}
          </div>
          <div>
            <Label>State</Label>
            <Field name="state" as={Input} />
            {touched.state && errors.state && (
              <div className="text-red-500 text-sm">{errors.state}</div>
            )}
          </div>
          <div>
            <Label>Postal Code</Label>
            <Field name="postalCode" as={Input} />
            {touched.postalCode && errors.postalCode && (
              <div className="text-red-500 text-sm">{errors.postalCode}</div>
            )}
          </div>
          <div>
            <Label>Country</Label>
            <Field name="country" as={Input} />
            {touched.country && errors.country && (
              <div className="text-red-500 text-sm">{errors.country}</div>
            )}
          </div>
          <div>
            <Label>
              <Field type="checkbox" name="isDefault" className='mr-2 size-4' />
              Set as default address
            </Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" >Save</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default function UserProfilePage() {
  const { user, logout, loading, refreshUser } = useContextData();
  const navigate = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await api.delete(`/user/addresses/${id}`);
        refreshUser();
        toast.success("Address deleted");
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSaveAddress = () => {
    setIsDrawerOpen(false);
    refreshUser();
  };

  const initialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      await api.put("/user", values);
      refreshUser();
      toast.success("Profile updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen mx-auto pt-24 overflow-hidden pb-10">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 800"
          className="max-h-96 w-fit mx-auto scale-125 -mt-40"
        >
          <g fill="#000000" id="cloud">
            <path
              d="M 150 350 A 1 1 0 1 1 744.502662538858 336.1256722416453 A 1 1 0 1 1 511.2565472188421 200.00000679056058 A 1 1 0 1 1 40.05235825783291 363.874338199955 A 1 1 0 1 1 748.6911240822358 406.2827044581867 A 1 1 0 1 1 693.6648955819494 311.5183167782129 A 1 1 0 1 1 280.89004484645966 576.7015767521883 A 1 1 0 1 1 150 350"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <div className="bg-gray-100 size-40 rounded-full flex justify-center items-center text-6xl text-purple-600 absolute bottom-10 left-1/2 -translate-x-1/2">
          {user?.firstName?.slice(0, 1) || user?.name?.slice(0, 1)}
        </div>
      </div>
      <div className="px-4" >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="block font-medium mb-1 flex items-center gap-2">
                  <User /> First Name
                </label>
                <Field
                  name="firstName"
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md"
                  placeholder="Enter your first name"
                />
                {touched.firstName && errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1 flex items-center gap-2">
                  <User /> Last Name
                </label>
                <Field
                  name="lastName"
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md"
                  placeholder="Enter your last name"
                />
                {touched.lastName && errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1 flex items-center gap-2">
                  <Phone /> Phone Number
                </label>
                <p className="w-full px-3 py-2 text-black border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed">
                  {user?.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block font-medium mb-1 flex items-center gap-2">
                  <Mail /> Email
                </label>
                <p className="w-full px-3 py-2 text-black border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed">
                  {user?.email}
                </p>
              </div>
              <div className="text-center">
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Profile
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="mt-8 px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium">Addresses</h2>
          <Button
            className="mt-4"
            onClick={() => {
              setEditingAddress(null);
              setIsDrawerOpen(true);
            }}
          >
            Add Address
          </Button>
        </div>
        {user?.addresses?.length ? (
          user.addresses.map((address) => (
            <div key={address.id} className="flex items-center justify-between py-2 border-b">
              <p>
                {address.addressLine1}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                {address.isDefault && <span className="ml-2 text-green-600">(Default)</span>}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAddress(address);
                    setIsDrawerOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteAddress(address.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="bg-black h-40 flex justify-center items-center mt-10" >No addresses added yet.</p>
        )}

      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-black w-full" >
          <DrawerHeader>
            <DrawerTitle>{editingAddress ? "Edit Address" : "Add Address"}</DrawerTitle>
          </DrawerHeader>
          <AddressForm
            address={editingAddress}
            onSave={handleSaveAddress}
            onCancel={() => setIsDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
      <div className="max-w-80 mx-auto w-full mt-8">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}