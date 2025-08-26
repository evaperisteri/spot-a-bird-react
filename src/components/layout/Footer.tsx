import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Binoculars, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple/90 text-offwhite py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="font-serif text-sm lg:text-base">
              © {currentYear} Spot A Bird App - All rights reserved
            </p>
            <p className="text-offwhite/70 text-xs m-1 text-center">
              Made with ♥ for bird enthusiasts
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/about" className="hover:text-sage transition-colors">
                About
              </Link>
              <Link to="/privacy" className="hover:text-sage transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-sage transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-sage transition-colors">
                Contact
              </Link>
            </div>
            <p className=" pt-2 text-xs text-offwhite/60 border-t border-offwhite/20">
              Observe responsibly • Protect wildlife • Share your{" "}
              <Binoculars className="inline h-3 w-3" />
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
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
              href="www.linkedin.com/in/evangelia-peristeri-984a44360"
              target="_blank"
              rel="noopener noreferrer"
              className="text-offwhite hover:text-sage transition-colors"
              aria-label="Twitter"
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

        {/* Mobile bottom text */}
        {/* <div className="text-center mt-6 pt-6 border-t border-offwhite/20">
          <p className="text-xs text-offwhite/60">
            Observe responsibly • Protect wildlife • Share your findings
          </p>
        </div> */}
      </div>
    </footer>
  );
}
