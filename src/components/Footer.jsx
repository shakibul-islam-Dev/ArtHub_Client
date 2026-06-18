import React from "react";
import Link from "next/link";
// সব আইকন react-icons থেকে এভাবে ইমপোর্ট করলে ঝামেলা কম হয়
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X Twitter এর জন্য আলাদা ভার্সন
import { GrInstagram } from "react-icons/gr";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Copyright Section */}
          <div>
            <h2 className="text-white text-xl font-bold mb-4">Art Hub</h2>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Art Hub. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-blue-400 transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-sky-400 transition"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-pink-400 transition"
              >
                <GrInstagram size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-blue-600 transition"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
