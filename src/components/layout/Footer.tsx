import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const footerLinks = {
  shop: [
    { title: "New Arrivals", href: "/new-arrivals" },
    { title: "Trending Now", href: "/trending" },
    { title: "Best Sellers", href: "/best-sellers" },
    { title: "Sale & Offers", href: "/sale" },
    { title: "Luxury Collection", href: "/luxury" },
  ],
  categories: [
    { title: "Men's Fashion", href: "/category/mens-fashion" },
    { title: "Women's Fashion", href: "/category/womens-fashion" },
    { title: "Accessories", href: "/category/accessories" },
    { title: "Footwear", href: "/category/footwear" },
    { title: "Watches & Jewelry", href: "/category/jewelry" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Press & Media", href: "/press" },
    { title: "Sustainability", href: "/sustainability" },
    { title: "Affiliate Program", href: "/affiliate" },
  ],
  support: [
    { title: "Help Center", href: "/help" },
    { title: "Shipping Policy", href: "/shipping" },
    { title: "Returns & Exchanges", href: "/returns" },
    { title: "Size Guide", href: "/size-guide" },
    { title: "Contact Us", href: "/contact" },
  ],
};

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/fashionket",
    label: "Facebook",
  },
  { icon: Twitter, href: "https://twitter.com/fashionket", label: "Twitter" },
  {
    icon: Instagram,
    href: "https://instagram.com/fashionket",
    label: "Instagram",
  },
  { icon: Youtube, href: "https://youtube.com/fashionket", label: "YouTube" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/fashionket",
    label: "LinkedIn",
  },
];

const contactInfo = [
  { icon: Phone, text: "+234 (0) 701 526-2642", href: "tel:+2347015262642" },
  {
    icon: Mail,
    text: "media@fashionket.com",
    href: "mailto:support@fashionket.com",
  },
  {
    icon: MapPin,
    text: "123 Fashion Ave, New York, NY 10001",
    href: "https://maps.google.com",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mmp-primary2 text-mmp-neutral">
      {/* Main Footer - Mobile Optimized */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:w-1/3">
            <Link to="/" className="inline-block mb-4 sm:mb-6">
              <img
                src="/logo.png"
                alt="FashionKet Logo"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            <p className="text-mmp-neutral/70 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
              Discover premium fashion curated for the modern lifestyle.
              Experience quality, style, and exclusive collections.
            </p>

            {/* Newsletter - Simplified for mobile */}
            <div className="mb-6 sm:mb-8">
              <h4 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mmp-secondary" />
                Subscribe for updates
              </h4>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-mmp-primary/20 border-mmp-primary/30 focus:border-mmp-secondary text-mmp-neutral placeholder:text-mmp-neutral/50 h-9 sm:h-10 text-sm"
                />
                <Button className="bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 h-9 sm:h-10 text-sm px-4 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links & Services */}
          <div className="lg:w-2/3">
            {/* Footer Links - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-bold text-sm sm:text-base capitalize text-mmp-secondary">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.title}>
                        <Link
                          to={link.href}
                          className="text-xs sm:text-sm text-mmp-neutral/70 hover:text-mmp-secondary transition-colors inline-block"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Store Registration Section - Simplified & Prominent */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-mmp-primary/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-mmp-secondary mb-1">
                    Sell on FashionKet
                  </h4>
                  <p className="text-xs sm:text-sm text-mmp-neutral/70">
                    Join thousands of sellers and grow your business
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-mmp-accent hover:bg-mmp-accent/10 hover:text-mmp-accent h-9 text-xs sm:text-sm px-3 sm:px-4"
                    asChild
                  >
                    <Link to="/vendor/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-mmp-accent to-mmp-secondary hover:opacity-90 h-9 text-xs sm:text-sm px-3 sm:px-4"
                    asChild
                  >
                    <Link to="/vendor/register">Register Store</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact & Social - Compact Grid */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-mmp-primary/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-3">
                {/* Contact Info - Simplified */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-mmp-secondary mb-3">
                    Contact
                  </h4>
                  <div className="space-y-2">
                    {contactInfo.slice(0, 2).map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Link
                          key={index}
                          to={info.href}
                          className="flex items-center gap-2 text-mmp-neutral/70 hover:text-mmp-secondary transition-colors text-xs sm:text-sm"
                          target={
                            info.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            info.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="truncate">{info.text}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media - Compact */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-mmp-secondary mb-3">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.slice(0, 4).map((social) => {
                      const Icon = social.icon;
                      return (
                        <Link
                          key={social.label}
                          to={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-mmp-primary/20 hover:bg-gradient-to-r hover:from-mmp-accent hover:to-mmp-secondary transition-all"
                          aria-label={social.label}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-mmp-neutral/70 hover:text-white transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Streamlined */}
      <div className="bg-mmp-primary/20 border-t border-mmp-primary/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Legal & Security - Horizontal Scroll on Mobile */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-3 sm:gap-4 min-w-max">
              <Link
                to="/privacy"
                className="text-[10px] sm:text-xs text-mmp-neutral/70 hover:text-mmp-secondary whitespace-nowrap"
              >
                Privacy
              </Link>
              <span className="text-mmp-neutral/30">•</span>
              <Link
                to="/terms"
                className="text-[10px] sm:text-xs text-mmp-neutral/70 hover:text-mmp-secondary whitespace-nowrap"
              >
                Terms
              </Link>
              <span className="text-mmp-neutral/30">•</span>
              <Link
                to="/cookies"
                className="text-[10px] sm:text-xs text-mmp-neutral/70 hover:text-mmp-secondary whitespace-nowrap"
              >
                Cookies
              </Link>
            </div>

            <Badge className="bg-mmp-primary/30 text-mmp-neutral/60 text-[8px] sm:text-[10px] px-2 py-0.5 whitespace-nowrap">
              <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              SSL Secured
            </Badge>
          </div>

          <Separator className="my-3 sm:my-4 bg-mmp-primary/30" />

          {/* Copyright & Powered By - Stack on Mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs">
            <div className="text-mmp-neutral/60 text-center sm:text-left">
              © {currentYear} FashionKet. All rights reserved.
            </div>

            <div className="flex items-center gap-3">
              {/* Payment - Simplified */}
              <div className="flex items-center gap-1">
                <span className="text-mmp-neutral/60 text-[8px] sm:text-[10px]">
                  Payments:
                </span>
                <span className="text-xs font-bold text-mmp-neutral/50 bg-mmp-primary/20 px-2 py-0.5 rounded">
                  PayStack
                </span>
              </div>

              {/* Powered By - Compact */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-mmp-primary/10 to-mmp-accent/10 border border-mmp-primary/30">
                <Heart className="h-2.5 w-2.5 text-mmp-accent" />
                <span className="text-[8px] sm:text-[10px] text-mmp-neutral/70">
                  Ultimate IntelliForge
                </span>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer - Smaller on Mobile */}
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-[8px] sm:text-[10px] text-mmp-neutral/50 max-w-2xl mx-auto px-2">
              FashionKet is a premium fashion retailer. Products subject to
              availability. Prices and offers may change without notice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
