import React from 'react';
import logoImg from '../../assets/Bmday_logo.png';
import visaImg from '../../assets/visa.png';
import { FaAlignRight, FaCcMastercard } from 'react-icons/fa';
import mpesaImg from '../../assets/mpesa.png';
import airtelImg from '../../assets/airtel-logo-icon.svg'
export default function Footer() {

  const catalogLinks = [
    { label: 'Custom Celebration Packs', href: '#packs' },
    { label: 'Party Decoration Kits', href: '#decor' },
  ];

  const assistanceLinks = [
    { label: 'Track Custom Order', href: '#track' },
    { label: 'Contact Support Desk', href: '#support' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Use', href: '#terms' },
  ];

  return (
    <footer className=" bg-[#0b3c5d] text-white pt-12 pb-6 px-5 mt-16 border-t border-[#086363]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#086a6a]">
        
        {/* COLUMN 1: CORPORATE LOGO & PURPOSE STATEMENT */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img 
              src={logoImg} 
              alt="Bmday Logo" 
              className="h-9 w-auto object-contain brightness-0 invert" 
            />
          </div>
         
        </div>

        {/* COLUMN 2: CELEBRATION SERVICES ACCESS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Our Catalog
          </h3>
          <ul className="space-y-2 text-xs text-teal-100 font-medium p-0 m-0 list-none">
            {catalogLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:text-white transition-colors duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3: CUSTOMER SERVICE PROTECTION GATEWAYS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Assistance
          </h3>
          <ul className="space-y-2 text-xs text-teal-100 font-medium p-0 m-0 list-none">
            {assistanceLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="hover:text-white transition-colors duration-200">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: NEWSLETTER SIGNUP & TRUST MARKERS */}
<div className="space-y-3">
  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
    Stay Updated
  </h3>
  <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
    <input 
      type="email" 
      placeholder="Enter email address" 
      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-white transition-all"
    />
    <button className="bg-white text-[#1e293b] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
      Join
    </button>
  </form>

  {/* 
   * CHANGED PART: Removed plain text statement.
   * Constructed an aligned logo row containing your distinct pixel and vector asset imports.
   */}
  <div className="pt-2">
    <p className="text-[10px] text-slate-400 font-sans uppercase tracking-wide m-0 mb-2">
      Secure Processing
    </p>
    <div className="flex items-center gap-3 bg-[#0f172a]/40 p-2 rounded-xl border border-[#334155]/40 w-fit">
      
      {/* 1. Local Visa Asset Image */}
      <img 
        src={visaImg} 
        alt="Visa" 
        className="h-4 w-auto object-contain select-none" 
      />

      {/* 2. React Icons Mastercard Component */}
      <FaCcMastercard 
        className="text-white text-xl select-none" 
      />

      {/* 3. Local M-Pesa Asset Image */}
      <img 
        src={mpesaImg} 
        alt="M-Pesa" 
        className="h-5 w-auto object-contain select-none" 
      />

      {/* 4. Public Directory Airtel Vector Asset */}
      <img 
        src={airtelImg}
        alt="Airtel Money" 
        className="h-5 w-auto object-contain select-none" 
      />

    </div>
  </div>
  </div>
  </div>



      {/* LOWER COMPLIANCE & RECONCILIATION BAR */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-teal-100/70 font-medium">
        <p className="m-0">
          &copy; {new Date().getFullYear()} Bmday. All rights reserved.
        </p>
        <div className="flex gap-4">
          {legalLinks.map((link, index) => (
            <a key={index} href={link.href} className="hover:text-white transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
