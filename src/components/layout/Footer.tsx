import { FaGithub } from "react-icons/fa";
import { Binoculars, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple/90 text-offwhite py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          {/* Copyright - centered on mobile, left-aligned on desktop */}
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="font-serif text-sm lg:text-base">
              © {currentYear} Spot A Bird App - All rights reserved
            </p>
            <p className="text-offwhite/70 text-xs mt-1">
              Made with ♥ for bird enthusiasts
            </p>
          </div>

          {/* Middle text - hidden on mobile, shown on desktop */}
          <div className="hidden md:block order-2">
            <p className="text-xs text-offwhite/60 border-t border-offwhite/20 pt-2">
              Observe responsibly • Protect wildlife • Share your{" "}
              <Binoculars className="inline h-4 w-4" />
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 order-1 md:order-3">
            <a
              href="https://github.com/evaperisteri/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite hover:text-sage transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/evangelia-peristeri-984a44360/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite hover:text-sage transition-colors"
              aria-label="Linked-in"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:evangeliaperisterig@gmail.com"
              className="text-offwhite hover:text-sage transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile bottom text - shown only on mobile */}
        <div className="text-center mt-6 pt-6 border-t border-offwhite/20 md:hidden">
          <p className="text-xs text-offwhite/60">
            Observe responsibly • Protect wildlife • Share your{" "}
            <Binoculars className="inline h-4 w-4" />
          </p>
        </div>
      </div>
    </footer>
  );
}
