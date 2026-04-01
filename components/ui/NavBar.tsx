"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center group-hover:bg-mosque transition-colors">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
              LuxeEstate
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1"
              href="#"
            >
              Buy
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Rent
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Sell
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="#"
            >
              Saved Homes
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-nordic-dark hover:text-mosque transition-colors block md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="material-icons">menu</span>
            </button>
            <button className="hidden md:block text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            <button className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'h-auto py-2' : 'h-0 py-0'}`}>
        <div className="px-4 space-y-1">
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10"
            href="#"
          >
            Buy
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            Rent
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            Sell
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5"
            href="#"
          >
            Saved Homes
          </Link>
        </div>
      </div>
    </nav>
  );
}
