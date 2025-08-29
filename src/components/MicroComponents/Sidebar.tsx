import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/helper";
// import { log } from "console";
// import api from "@/lib/api";

interface Props {
  isSidebarOpen: boolean;
  setSidebar: (isSidebarOpen: boolean) => void;
  user: any;
  loading: boolean;
  logout: () => Promise<void>;
}
type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  image: string;
};

const Sidebar = ({
  isSidebarOpen,
  setSidebar,
  user,
  loading,
  logout,
}: Props) => {
  const navigate = useRouter();
  const [categories, setCategories] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setSidebar(false);
    }
  };

  async function getCategories() {
    try {
      const res = await apiClient<Category[]>('https://demonoid.in:3542/categories/');
      // log("categories==", res);
      // console.log("categories==", res);

      setCategories(res);
    } catch (error) {
      console.log("Error in getting categories");
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-60 z-40 h-screen"
          onClick={() => setSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed bg-white w-[75vw] h-dvh md:w-[400px] duration-500 z-50 transition-all top-0 border left-4 flex flex-col justify-between ${isSidebarOpen
          ? "-translate-x-5 border-r-4 border-white/10"
          : "-translate-x-[110%] border-0"
          }`}
      >
        <div className="px-4 pt-3">
          {/* <div className="flex justify-between h-20 items-center">
            <p className="text-black text-2xl font-semibold">Side Menu</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-10 duration-300 transition-all ${isSidebarOpen ? "rotate-90" : "rotate-45"
                }`}
              onClick={() => setSidebar(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div> */}

          <ul className="w-full">
            <Link href="/" onClick={() => setSidebar(false)}>
              <li className="py-4 px-4 text-black rounded my-1 w-full uppercase">
                Home
              </li>
            </Link>
            <Link href="/crazy-deals" onClick={() => setSidebar(false)}>
              <li className="py-4 px-4 rounded my-1 text-black uppercase">
                Crazy deals
              </li>
            </Link>
            <Link
              href="/home-installation-service"
              onClick={() => setSidebar(false)}
            >
              <li className="py-4 px-4 rounded my-1 text-black uppercase">
                Home Installation service
              </li>
            </Link>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="w-full text-black uppercase py-4 px-4 rounded">
                  Categories
                </AccordionTrigger>
                <AccordionContent className="w-full text-black rounded max-h-60 overflow-y-clip">
                  {categories?.map((category) => {
                    return (
                      <Link
                        key={category.id}
                        onClick={() => setSidebar(false)}
                        href={`/category/${category?.slug}`}
                      >
                        <li className="py-4 px-8 rounded my-1">
                          {category?.name}
                        </li>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ul>
        </div>

        <ul className="w-full flex flex-col items-center justify-between px-4 gap-10">
          <div className="w-full mb-10">
            {user && (
              <Accordion type="single" collapsible>
                <AccordionItem value="user-menu">
                  <AccordionTrigger className="w-full h-14 flex justify-between items-center px-4">
                    <p className="text-lg">{user?.name}</p>
                  </AccordionTrigger>
                  <AccordionContent className="w-full rounded-b-lg">
                    <div className="grid grid-cols-1 p-2">
                      <Link
                        href="/track-your-orders"
                        onClick={() => setSidebar(false)}
                      >
                        <Button className="py-4 h-12 px-4 rounded my-1 text-black w-full">
                          Track your orders
                        </Button>
                      </Link>

                      {user.role === "CUSTOMER" && (
                        <Link href="/profile" onClick={() => setSidebar(false)}>
                          <Button className="py-4 h-12 bg-zinc-800 px-4 rounded my-1 text-black w-full">
                            Your Account
                          </Button>
                        </Link>
                      )}

                      {(user.role === "ADMIN" ||
                        user.role === "SUPER_ADMIN") && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setSidebar(false)}
                          >
                            <Button className="py-4 h-12 px-4 rounded my-1 text-black w-full">
                              Admin Dashboard
                            </Button>
                          </Link>
                        )}

                      <Button
                        onClick={handleLogout}
                        className="py-4 h-12 bg-zinc-800 px-4 rounded my-1 text-white w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {!user && (
              <Link href="/auth/login" onClick={() => setSidebar(false)}>
                <Button className="py-4 h-12 bg-zinc-800 px-4 rounded my-1 text-white w-full">
                  Login or Register
                </Button>
              </Link>
            )}
          </div>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
