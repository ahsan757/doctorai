"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-400 to-blue-600 text-white text-center py-12">
      {/* Subscribe Section */}
      <div className="mb-6 flex justify-center px-4">
        <div className="bg-white/20 p-6 sm:p-3 rounded-full flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <input
            type="email"
            placeholder="Your Email Address"
            required
            className="px-4 py-2 rounded-full text-black outline-none w-full sm:w-72"
          />
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-full w-full sm:w-auto">
            Subscribe
          </Button>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 text-center md:text-left">
        {/* Logo & About */}
        <div>
          <h3 className="font-bold text-lg">Dr AI</h3>
          <p className="text-sm mt-2">
            &quot;AI is driven by data, not belief.&quot;
          </p>
          <a
            href="mailto:support@drai.com"
            className="text-yellow-300 mt-2 block break-words"
          >
            support@drai.com
          </a>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-bold text-lg">Company</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Services
              </a>
            </li>
          </ul>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="font-bold text-lg">Important</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-yellow-300">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Terms
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-yellow-300">
                Why Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-300">
                Articles
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg">Info</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex justify-center md:justify-start items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-300" />
              Tech City, CA
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <Mail className="w-4 h-4 text-yellow-300" />
              <a
                href="mailto:company@drai.com"
                className="hover:text-yellow-300 break-words"
              >
                company@drai.com
              </a>
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <Phone className="w-4 h-4 text-yellow-300" />
              +1 555-123-4567
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Text */}
      <div className="mt-6 text-sm">
        <p>© 2025 Dr AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
