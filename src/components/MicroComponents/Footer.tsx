import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiInstagram, FiYoutube, FiFacebook } from "react-icons/fi";
import FooterAccordion from "../FooterAccordion";
import { FaLinkedinIn } from "react-icons/fa";

const sections = [
  {
    title: "Company",
    pages: [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Services", path: "/terms-of-services" },
    ],

  },
]
const sections2 = [{
  title: "Support",
  pages: [
    { name: "Warranty Policy", path: "/warranty-policy" },
    { name: "Shipping Policy", path: "/shipping-policy" },
    { name: "Home Installation Service", path: "/home-installation-service" },
    { name: "Track Your Orders", path: "/track-your-orders" },
  ],
},
]
const sections3 = [{
  title: "Shop",
  pages: [
    { name: "Best Sellers", path: "/best-sellers" },
    { name: "Crazy Deals", path: "/crazy-deals" },
    { name: "Categories", path: "/categories" },
    { name: "Wishlist", path: "/wishlist" },
  ],
},
];

const Footer = () => {
  return (<>

    <div className="bg-white flex flex-col justify-center w-full border-t border-gray-400/30 px-4">
      {/* Logo and Social Media */}
      <div className=" w-full py-20">
        <div className=" absolute left-1/2 -translate-x-1/2">
          <Image src="/Demonoid.png" alt="Logo" width={1200} height={600} className="w-full max-w-4xl h-auto object-cover" />
        </div>
      </div>

      <div className="flex justify-center bg-neupx-4">
        <div className="w-full">
          <span className="text-sm text-black"><h6 className="capitalize">Let Get Social</h6></span>
        </div>

        <div className="flex items-center space-x-4">

          <Link href="https://instagram.com" target="_blank">
            <FiInstagram size={25} className="text-black hover:text-gray-400" />
          </Link>
          <Link href="https://facebook.com" target="_blank">
            <FiFacebook size={25} className="text-black hover:text-gray-400" />
          </Link>
          <Link href="https://youtube.com" target="_blank">
            <FiYoutube size={25} className="text-black hover:text-gray-400" />
          </Link>
          <Link href="https://www.linkedin.com" target="_blank">
            <FaLinkedinIn size={25} className="text-black hover:text-gray-400" />
          </Link>
        </div>
      </div>


      {/* Links Section */}
      <div className="mt-3 w-full pt-3">
        <FooterAccordion accordiondata={sections2} />
        <FooterAccordion accordiondata={sections3} />
        <FooterAccordion accordiondata={sections} />
      </div>

    </div>
    {/* Footer Bottom */}
    <div className="py-4 w-full text-center text-sm text-white bg-black">
      Privacy Policy Terms Of Use Warranty Policy © 2025 Demoniod Limited. All rights reserved.
    </div>
  </>
  );
};

export default Footer;
