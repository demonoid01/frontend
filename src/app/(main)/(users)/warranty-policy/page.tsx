"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import WarrantySupportForm from "@/components/WarrantySupportForm";
import Link from "next/link";
import Image from "next/image";

export default function WarrantySupportPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6 pt-40 pb-20 animate-fadeIn">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-center mb-12">
        🔧 Warranty Support
      </h1>

      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto mb-14 text-muted-foreground text-lg">
        At Demonoid, we stand behind the quality of our products. In the rare
        event of a manufacturing defect, we've got your back with a smooth,
        worry-free warranty process.
      </div>

      {/* Warranty Details */}
      <section className="space-y-6 mb-16">
        <h2 className="text-3xl font-bold mb-4">📋 Warranty Details</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="p-6 rounded-2xl bg-muted/20 shadow-sm shadow-white/20">
            <h3 className="font-semibold mb-2">Warranty Period</h3>
            <p>
              1 Year — On major electronics (stereos, dash cams, amplifiers).
              <br />3 Months — On wiring kits, CANBUS modules, accessories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-muted/20 shadow-sm shadow-white/20">
            <h3 className="font-semibold mb-2">What's Covered</h3>
            <p>
              Manufacturing defects, software malfunction, internal component
              failure (normal usage).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-muted/20 shadow-sm shadow-white/20">
            <h3 className="font-semibold mb-2">What’s Not Covered</h3>
            <p>
              Physical/liquid damage, faulty installation, tampered serial
              numbers, unauthorized servicing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-muted/20 shadow-sm shadow-white/20 text-sm">
            <p className="text-muted-foreground">
              ⚡ Note: Warranty terms vary by product. Please check the
              individual product page for specific details.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Process */}
      <section className="space-y-6 mb-16">
        <h2 className="text-3xl font-bold mb-8">🛠️ Warranty Process</h2>

        <div className="space-y-8">
          {[
            {
              title: "Step 1: Register Your Complaint",
              desc: "Fill out the Customer Support Form with your order ID, product details, and issue clearly mentioned. Our team will respond within 24–48 hours.",
            },
            {
              title: "Step 2: Home Pickup",
              desc: "We'll schedule a home pickup via our courier partner. Please pack the product securely in the original packaging.",
            },
            {
              title: "Step 3: Repair or Replacement",
              desc: "Your product will be repaired or replaced as per warranty terms. Estimated turnaround: 5–10 business days.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-muted/10 shadow-sm shadow-blue-600/10"
            >
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="space-y-4 mb-16">
        <h2 className="text-3xl font-bold mb-4">📌 Important Notes</h2>

        <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
          <li>Warranty claims require original invoice/order ID.</li>
          <li>Pickup and redelivery are free for eligible warranty claims.</li>
          <li>Unauthorized modifications void warranty eligibility.</li>
        </ul>
      </section>

      {/* Form Button */}
      <div className="text-center mb-20">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" className="text-lg rounded-full">
              📝 Fill out the Customer Support Form
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6 w-full max-h-[75vh] bg-[#111] border-none">
            <WarrantySupportForm />
          </DrawerContent>
        </Drawer>
      </div>

      {/* FAQ Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-center mb-10">
          ❓ Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "How long does it take to process warranty claims?",
              a: "It usually takes 5–10 business days after receiving your product.",
            },
            {
              q: "Is shipping free for warranty pickups?",
              a: "Yes, pickup and delivery are free for eligible warranty claims.",
            },
            {
              q: "What if my product is out of warranty?",
              a: "We offer paid repair services depending on the issue.",
            },
          ].map((item, index) => (
            <details
              key={index}
              className="rounded-xl p-5 bg-muted/20 cursor-pointer shadow"
            >
              <summary className="font-semibold text-lg">{item.q}</summary>
              <p className="mt-2 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <div className="text-center mt-24 space-y-4">
        <p className="text-xl font-semibold">Still need help?</p>
        <p>
          📩 Email us at:{" "}
          <a
            href="mailto:support@nomadcustoms.com"
            className="text-blue-600 underline font-semibold"
          >
            support@nomadcustoms.com
          </a>
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          💬 Or WhatsApp us →{" "}
          <Link
            href="https://wa.me/918506996445?text=Hey%2C%20I%20need%20assistance%20related%20to%20warranty.%20I%20found%20your%20link%20on%20the%20help%20page."
            target="_blank"
            className="hover:scale-110 transition-transform"
          >
            <Image
              src="/whatsapp.png"
              width={40}
              height={40}
              alt="WhatsApp Icon"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
