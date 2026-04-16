import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#238636] border-t border-[#30363d] mt-10">

  <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

    {/* Left */}
    <div>
      <h3 className="text-lg font-semibold text-white">
        WorkHive
      </h3>
      <p className="text-sm text-gray-200">
        Smart Resource Booking System
      </p>
    </div>

    {/* Right */}
    <div>
      <p className="text-sm text-gray-200">
        © 2026 WorkHive
      </p>
      <p className="text-sm text-gray-200">
        All rights reserved
      </p>
    </div>

  </div>

</footer>
  );
};

export default Footer;