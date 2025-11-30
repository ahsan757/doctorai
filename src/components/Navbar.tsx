"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pages", href: "/pages" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-8 py-4 z-50">
      {/* Logo */}
      <Link href="/" className="text-blue-500 font-bold text-lg">
        Doctor AI
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-gray-700 hover:text-blue-500 transition duration-300"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Search & Appointment */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Search Icon */}
        <Dialog>
          <DialogTrigger>
            <Search className="w-6 h-6 text-gray-700 hover:text-blue-500 cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="p-6 rounded-lg shadow-lg bg-white">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-5"
            />
            <Button className="w-full mt-4 bg-blue-500">Search</Button>
          </DialogContent>
        </Dialog>

        {/* Appointment Button */}
        <Button className="bg-blue-500 hover:bg-green-500 text-white px-5">
          Appointment
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu with Open/Close Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }} // Animate on close
            transition={{ type: "spring", stiffness: 100 }}
            className="absolute top-0 left-0 w-3/4 h-screen bg-white shadow-lg py-6 md:hidden"
          >
            <ul className="flex flex-col items-start px-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-blue-500 transition duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <div className="my-3">
                  <Dialog>
                    <DialogTrigger>
                      <Search className="w-6 h-6 text-gray-700 hover:text-blue-500 cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="p-6 rounded-lg shadow-lg bg-white">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-5"
                      />
                      <Button className="w-full mt-4 bg-blue-500">Search</Button>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button
                  className="bg-blue-500 hover:bg-green-500 text-white px-5"
                  onClick={() => setMenuOpen(false)}
                >
                  Appointment
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
