import Navbar from "@/components/MicroComponents/Navbar";
import Footer from "@/components/MicroComponents/Footer";
import Image from "next/image";
import Link from "next/link";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-screen-2xl mx-auto relative">
        {children}
        {/* <span className="fixed bottom-4 right-4 z-50 bg-black p-4 rounded-full">
          <Link
            href={
              "https://wa.me/918506996445?text=I'm%20interested%20in%20purchasing%20automobile%20parts.%20Can%20you%20share%20more%20details"
            }
            target="_blank"
          >
            <Image
              src={"/whatsapp.png"}
              width={40}
              height={40}
              alt="Whatsapp Icon"
            />
          </Link>
        </span> */}
      </main>

      <Footer />
    </>
  );
}