'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {
  const whatsappNumber = '919006444344'; // without + or spaces
  const [whatsappUrl, setWhatsappUrl] = useState('#');

  useEffect(() => {
    const message = '1. Hello Agent! I have a question about WasteWise.\n2. Hello Agent! I have ordered a product can you please send me your QR code';
    setWhatsappUrl(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    );
  }, []); // Empty dependency array to run only once

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.778.46 3.435 1.268 4.883L2 22l5.24-1.229A9.94 9.94 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.207 14.402c-.22.62-1.288 1.176-1.782 1.252-.456.07-1.043.1-1.682-.105-.388-.122-.883-.287-1.523-.56-2.67-1.157-4.41-3.843-4.546-4.02-.133-.178-1.085-1.446-1.085-2.758 0-1.311.686-1.958.928-2.222.242-.265.53-.331.706-.331.177 0 .353.002.507.009.164.007.381-.062.596.457.22.53.748 1.835.814 1.968.068.132.113.287.023.465-.09.177-.135.287-.267.443-.134.156-.28.348-.399.467-.134.134-.273.28-.117.55.157.265.693 1.144 1.487 1.857 1.023.91 1.847 1.19 2.113 1.32.266.133.421.112.58-.067.156-.178.668-.778.848-1.046.178-.266.355-.222.596-.133.242.089 1.527.72 1.79.85.265.133.443.2.508.31.066.11.066.643-.155 1.265z"/>
        </svg>
      </Link>
    </div>
  );
}