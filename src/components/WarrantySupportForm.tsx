"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

export default function WarrantySupportForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    dateOfPurchase: "",
    orderId: "",
    issue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post("/support-tickets", {
        type: "WARRANTY",
        submitterName: formData.name,
        submitterMobile: formData.mobile,
        dateOfPurchase: new Date(formData.dateOfPurchase).toISOString(),
        orderId: formData.orderId || null,
        description: formData.issue,
      });
      toast.success("Warranty support request submitted successfully!");
      router.push("/"); // Redirect to homepage or a thank you page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-6 pt-10 pb-20 h-[75vh] overflow-y-auto scrollbar-none">
      <h1 className="text-2xl font-bold text-center">
        Warranty Support Request
      </h1>
      <div className="space-y-4 mt-10">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            placeholder="Enter your mobile number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
          />
        </div>
        <div>
          <Label htmlFor="dateOfPurchase">Date of Purchase</Label>
          <Input
            id="dateOfPurchase"
            name="dateOfPurchase"
            type="date"
            value={formData.dateOfPurchase}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="orderId">Order ID (Optional)</Label>
          <Input
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder="Enter your order ID"
          />
        </div>
        <div>
          <Label htmlFor="issue">Issue with Product</Label>
          <Textarea
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
            placeholder="Describe the issue with your product"
          />
        </div>
        <Button type="button" className="bg-blue-600 text-white w-full" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
}
