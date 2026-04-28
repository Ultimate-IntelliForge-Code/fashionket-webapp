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
    color: "#1877f2",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/fashionket",
    label: "Twitter",
    color: "#1da1f2",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/fashionket",
    label: "Instagram",
    color: "#e4405f",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/fashionket",
    label: "YouTube",
    color: "#ff0000",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/fashionket",
    label: "LinkedIn",
    color: "#0077b5",
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
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <footer className="bg-mmp-primary2 text-white relative overflow-hidden border-t-2 border-mmp-primary">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mmp-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-mmp-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mmp-neutral/5 rounded-full blur-3xl" />
      </div>

      {/* Features Bar */}
      {/* <div className="relative border-b border-mmp-primary2/20 bg-mmp-primary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 sm:py-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-mmp-primary2/20 group-hover:bg-mmp-primary/20 transition-all duration-300">
                    <Icon className="h-5 w-5 text-mmp-secondary group-hover:text-mmp-neutral transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white truncate">
                      {feature.title}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div> */}

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
            <Link to="/" className="inline-block group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="/logo.png"
                alt="FashionKet Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </Link>

            <p className="text-white/70 text-sm leading-relaxed">
              Discover premium fashion curated for the modern lifestyle.
              Experience quality, style, and exclusive collections from top
              brands worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-mmp-secondary" />
                Subscribe for updates
              </h4>
              <div className="flex flex-col xs:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-mmp-primary2/30 focus:border-mmp-secondary text-white placeholder:text-white/50 rounded-xl h-11 text-sm focus:bg-white/20 transition-all duration-300"
                />
                <Button className="bg-mmp-primary hover:shadow-lg hover:scale-105 transition-all duration-300 h-11 px-6 rounded-xl text-sm font-medium whitespace-nowrap group">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-white/40 text-xs">
                Get 10% off your first purchase
              </p>
            </div>
          </motion.div>

          {/* Links Grid */}
          <motion.div variants={fadeInUp} className="lg:w-2/3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
              {Object.entries(footerLinks).map(([category, links]) => (
                <motion.div
                  key={category}
                  variants={fadeInUp}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-base capitalize text-mmp-secondary relative inline-block">
                    {category}
                    <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-mmp-primary rounded-full" />
                  </h3>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.title}>
                        <Link
                          to={link.href}
                          className="text-sm text-white/60 hover:text-mmp-secondary transition-all duration-300 inline-block group"
                        >
                          <span className="group-hover:translate-x-1 inline-block transition-transform">
                            {link.title}
                          </span>
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
              className="mt-10 pt-8 border-t border-mmp-primary2/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <h4 className="font-semibold text-mmp-secondary mb-1 flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Sell on FashionKet
                  </h4>
                  <p className="text-sm text-white/60">
                    Join thousands of sellers and grow your business with us
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border-mmp-primary2/40 text-white hover:text-mmp-primary hover:bg-mmp-primary/10 hover:border-mmp-primary rounded-xl h-10 px-5 transition-all duration-300"
                    asChild
                  >
                    <Link to="/vendor/login">Login</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-mmp-primary hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl h-10 px-5 font-medium"
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
              className="mt-10 pt-8 border-t border-mmp-primary2/30"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-mmp-secondary mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Link
                          key={index}
                          to={info.href}
                          className="flex items-center gap-3 text-white/60 hover:text-mmp-secondary transition-all duration-300 text-sm group"
                          target={
                            info.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            info.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-mmp-primary/20 transition-all duration-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span>{info.text}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-semibold text-mmp-secondary mb-4">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -3, scale: 1.1 }}
                          className="p-2.5 rounded-xl bg-white/10 hover:shadow-lg transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${social.color}20, ${social.color}10)`,
                            borderColor: `${social.color}40`,
                          }}
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
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
      <div className="relative bg-mmp-primary2 backdrop-blur-sm border-t border-mmp-primary2/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link
                to="/privacy"
                className="text-white/60 hover:text-mmp-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20">•</span>
              <Link
                to="/terms"
                className="text-white/60 hover:text-mmp-secondary transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-white/20">•</span>
              <Link
                to="/cookies"
                className="text-white/60 hover:text-mmp-secondary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Security Badge */}
              <Badge className="bg-white/10 text-white/80 border border-white/20 px-3 py-1 rounded-full text-xs">
                <Shield className="h-3 w-3 mr-1.5" />
                SSL Secured
              </Badge>

              {/* Copyright */}
              <div className="text-white/50 text-sm">
                © {currentYear} FashionKet. All rights reserved.
              </div>
            </div>
          </div>

          {/* Powered By */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-mmp-primary/10 to-mmp-secondary/10 border border-mmp-primary2/30">
              <Heart className="h-3.5 w-3.5 text-mmp-primary animate-pulse" />
              <span className="text-xs text-white/60">
                Powered by{" "}
                <span className="font-semibold text-mmp-secondary">
                  Ultimate IntelliForge
                </span>
              </span>
            </div>
          </motion.div>

          {/* Legal Disclaimer */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-white/40 max-w-2xl mx-auto">
              FashionKet is a premium fashion retailer. Products subject to
              availability. Prices and offers may change without notice. All
              trademarks and logos are property of their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}