import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md text-black pt-16 pb-8 relative border-t-2 border-black overflow-hidden">
      {/* Bottom red accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#660000]/80"></div>
      
      {/* Glassmorphism decorative elements */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#660000]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-16 w-80 h-80 bg-black/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-1/3 w-40 h-40 bg-[#660000]/5 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Magazine Style Header */}
        <div className="text-center mb-12 pb-12 border-b border-black/20">
          <h2 className="font-metal text-3xl tracking-wider uppercase mb-4">
            <span className="text-black">VES</span>
            <span className="text-[#660000]">TIGE</span>
          </h2>
          <p className="font-serif italic text-lg max-w-xl mx-auto text-black/70 backdrop-blur-sm bg-white/30 p-4">
            &ldquo;Fashion is not something that exists in dresses only. Fashion is in the sky, in the street. Fashion has to do with ideas, the way we live.&rdquo;
          </p>
          <div className="mt-4 flex justify-center items-center">
            <div className="w-6 h-[1px] bg-[#660000]"></div>
            <p className="mx-3 text-sm font-gothic">COCO CHANEL</p>
            <div className="w-6 h-[1px] bg-[#660000]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 mb-16 border-b border-black/20 pb-16">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6 backdrop-blur-sm bg-white/40 p-6">
            <div className="heading-clean">
              <h3 className="text-lg font-gothic text-black uppercase tracking-widest relative inline-block">
                About Us
                <span className="absolute -top-2 -right-2 text-[#660000] text-[10px]">®</span>
              </h3>
              <div className="w-12 h-[1px] bg-[#660000] mt-2"></div>
            </div>
            <p className="text-black/80 text-sm leading-relaxed font-serif">
              Curated limited-edition collections from independent designers and luxury fashion houses. Shop rare and exclusive pieces with a gothic edge and eternal style.
            </p>
            <div className="pt-2 flex space-x-4">
              <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center text-black/80 hover:text-[#660000] border border-black/20 hover:border-[#660000] backdrop-blur-md bg-white/30">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="h-9 w-9 flex items-center justify-center text-black/80 hover:text-[#660000] border border-black/20 hover:border-[#660000] backdrop-blur-md bg-white/30">
                <Twitter size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center text-black/80 hover:text-[#660000] border border-black/20 hover:border-[#660000] backdrop-blur-md bg-white/30">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="Email" className="h-9 w-9 flex items-center justify-center text-black/80 hover:text-[#660000] border border-black/20 hover:border-[#660000] backdrop-blur-md bg-white/30">
                <Mail size={16} />
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div className="md:col-span-2 backdrop-blur-sm bg-white/20 p-4">
            <div className="heading-clean">
              <h4 className="text-sm uppercase tracking-wide font-gothic font-bold text-black">Shop</h4>
              <div className="w-6 h-[1px] bg-[#660000] mt-2"></div>
            </div>
            <div className="space-y-3 mt-6">
              {[
                "New Arrivals", "Designers", "Collections", 
                "Accessories", "Outerwear", "Footwear"
              ].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-black/70 hover:text-[#660000] transition-colors duration-200 text-sm font-serif"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 backdrop-blur-sm bg-white/20 p-4">
            <div className="heading-clean">
              <h4 className="text-sm uppercase tracking-wide font-gothic font-bold text-black">Info</h4>
              <div className="w-6 h-[1px] bg-[#660000] mt-2"></div>
            </div>
            <div className="space-y-3 mt-6">
              {[
                "About Us", "How It Works", "Authenticity", 
                "Editorial", "FAQs", "Sustainability"
              ].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-black/70 hover:text-[#660000] transition-colors duration-200 text-sm font-serif"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 backdrop-blur-sm bg-white/20 p-4">
            <div className="heading-clean">
              <h4 className="text-sm uppercase tracking-wide font-gothic font-bold text-black">Support</h4>
              <div className="w-6 h-[1px] bg-[#660000] mt-2"></div>
            </div>
            <div className="space-y-3 mt-6">
              {[
                "Contact Us", "Shipping", "Returns", 
                "Size Guide", "Privacy Policy", "Terms of Service"
              ].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-black/70 hover:text-[#660000] transition-colors duration-200 text-sm font-serif"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-2 backdrop-blur-md bg-white/40 p-4">
            <div className="heading-clean">
              <h4 className="text-sm uppercase tracking-wide font-gothic font-bold text-black">Newsletter</h4>
              <div className="w-6 h-[1px] bg-[#660000] mt-2"></div>
            </div>
            <div className="space-y-4 mt-6">
              <p className="text-sm text-black/70 font-serif">Sign up to receive early access to drops and exclusive offers.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full py-2 px-3 bg-white/30 backdrop-blur-sm border border-black/20 text-black placeholder-black/50 focus:outline-none focus:border-black/80 text-sm"
                />
                <button className="w-full py-2 px-4 bg-black/80 backdrop-blur-sm text-white text-xs tracking-wide uppercase font-gothic font-medium hover:bg-[#660000] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="relative backdrop-blur-sm bg-white/30 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-black/60">
            <div className="mb-4 md:mb-0 font-serif">
              © {new Date().getFullYear()} VESTIGE. All rights reserved.
            </div>
            <div className="flex space-x-6 items-center">
              <span className="font-gothic text-xs tracking-widest uppercase flex items-center">
                <span className="w-3 h-[1px] bg-[#660000] mr-2"></span>
                Eternal Style
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;