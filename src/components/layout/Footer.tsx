import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
  ArrowRight,
  Clock,
  Award,
  Truck,
  CreditCard,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { icon: Facebook, href: "https://facebook.com/fashionket", label: "Facebook", color: "#1877f2" },
  { icon: Twitter, href: "https://twitter.com/fashionket", label: "Twitter", color: "#1da1f2" },
  { icon: Instagram, href: "https://instagram.com/fashionket", label: "Instagram", color: "#e4405f" },
  { icon: Youtube, href: "https://youtube.com/fashionket", label: "YouTube", color: "#ff0000" },
  { icon: Linkedin, href: "https://linkedin.com/company/fashionket", label: "LinkedIn", color: "#0077b5" },
];

const contactInfo = [
  { icon: Phone, text: "+234 (0) 701 526-2642", href: "tel:+2347015262642" },
  { icon: Mail, text: "media@fashionket.com", href: "mailto:support@fashionket.com" },
  { icon: MapPin, text: "123 Fashion Ave, New York, NY 10001", href: "https://maps.google.com" },
];

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
  { icon: CreditCard, title: "Secure Payment", description: "100% secure transactions" },
  { icon: Clock, title: "24/7 Support", description: "Dedicated customer service" },
  { icon: Award, title: "Quality Guarantee", description: "Premium products only" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <footer className="bg-brand-dark text-white relative border-t border-brand-primary/20">
      {/* Decorative Background - Simplified for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Features Bar - Uncommented and improved */}
      <div className="relative border-b border-white/10 bg-brand-dark/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 sm:py-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand-primary-soft/20 transition-colors">
                    <Icon className="h-5 w-5 text-brand-accent group-hover:text-brand-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {feature.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col lg:flex-row gap-10 lg:gap-16"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:w-1/3 space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </Link>

            <p className="text-white/60 text-sm leading-relaxed">
              Discover premium fashion curated for the modern lifestyle.
              Experience quality, style, and exclusive collections from top
              brands worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-accent" />
                Subscribe for updates
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/5 border-white/10 focus:border-brand-primary text-white placeholder:text-white/40 rounded-lg h-11 text-sm focus:bg-white/10 transition-all"
                />
                <Button className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-sm h-11 px-6 rounded-lg text-sm font-medium whitespace-nowrap group">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-white/40 text-xs flex items-center gap-1">
                <Heart className="h-3 w-3 text-brand-accent" />
                Get 10% off your first purchase
              </p>
            </div>
          </motion.div>

          {/* Links Grid */}
          <motion.div variants={fadeInUp} className="lg:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
              {Object.entries(footerLinks).map(([category, links]) => (
                <motion.div key={category} variants={fadeInUp} className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-brand-accent">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.title}>
                        <Link
                          to={link.href}
                          className="text-sm text-white/50 hover:text-brand-primary transition-colors duration-200"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Vendor Section */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 pt-8 border-t border-white/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <h4 className="font-semibold text-brand-accent mb-1 flex items-center gap-2 text-sm">
                    <Store className="h-4 w-4" />
                    Sell on FashionKet
                  </h4>
                  <p className="text-sm text-white/50">
                    Join thousands of sellers and grow your business with us
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-lg h-10 px-5"
                    asChild
                  >
                    <Link to="/vendor/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm rounded-lg h-10 px-5 font-medium"
                    asChild
                  >
                    <Link to="/vendor/register">Register Store</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Contact & Social */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 pt-8 border-t border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-brand-accent mb-4 flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    Contact
                  </h4>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Link
                          key={index}
                          to={info.href}
                          className="flex items-center gap-3 text-white/50 hover:text-brand-primary transition-colors text-sm group"
                          target={info.href.startsWith("http") ? "_blank" : undefined}
                          rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          <Icon className="h-4 w-4 text-white/30 group-hover:text-brand-primary transition-colors" />
                          <span>{info.text}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-semibold text-brand-accent mb-4 text-sm">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -2 }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5 text-white/60 hover:text-brand-primary transition-colors" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-black/20 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs">
              <Link
                to="/privacy"
                className="text-white/40 hover:text-brand-primary transition-colors"
              >
                Privacy
              </Link>
              <span className="text-white/20">•</span>
              <Link
                to="/terms"
                className="text-white/40 hover:text-brand-primary transition-colors"
              >
                Terms
              </Link>
              <span className="text-white/20">•</span>
              <Link
                to="/cookies"
                className="text-white/40 hover:text-brand-primary transition-colors"
              >
                Cookies
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Security Badge */}
              <Badge className="bg-white/5 text-white/60 border-white/10 rounded-full text-xs font-normal px-3 py-1">
                <Shield className="h-3 w-3 mr-1.5" />
                SSL Secured
              </Badge>

              {/* Copyright */}
              <div className="text-white/40 text-xs">
                © {currentYear} FashionKet. All rights reserved.
              </div>
            </div>
          </div>

          {/* Powered By */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Heart className="h-3 w-3 text-brand-accent" />
              <span className="text-xs text-white/40">
                Powered by{" "}
                <span className="text-brand-primary font-medium">
                  Ultimate IntelliForge
                </span>
              </span>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-white/30 max-w-2xl mx-auto">
              FashionKet is a premium fashion retailer. Products subject to
              availability. Prices and offers may change without notice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}