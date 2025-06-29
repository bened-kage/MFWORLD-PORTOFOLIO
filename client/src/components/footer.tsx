import { Instagram, MessageCircle, Linkedin, Github, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SocialLink, Biodata } from "@shared/schema";
import { Link } from "wouter";

export default function Footer() {
  const { data: biodata } = useQuery<Biodata>({ queryKey: ["/api/biodata"] });
  const { data: socialLinks = [] } = useQuery<SocialLink[]>({ queryKey: ["/api/social-links"] });
  const currentYear = new Date().getFullYear();

  // Icon mapping
  const getIcon = (platform: string) => {
    const p = platform.toLowerCase().trim();
    switch (p) {
      case 'instagram':
        return Instagram;
      case 'whatsapp':
        return MessageCircle;
      case 'linkedin':
      case 'linkidn': // typo tolerance
        return Linkedin;
      case 'github':
        return Github;
      case 'twitter':
        return Twitter;
      case 'facebook':
        return Facebook;
      case 'email':
        return Mail;
      default:
        return MessageCircle;
    }
  };

  // Motto: hilangkan semua line break, tab, dan trim
  const motto = (biodata?.title || 'UI/UX DESAINER AND MATH MENTOR')
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <footer className="w-full backdrop-blur-md bg-black/60 border-t border-white/10 pt-12 pb-6 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1.7fr_1.2fr_2fr] gap-8 items-start">
          {/* Kolom 1: Nama Web & Bio */}
          <div className="flex flex-col items-start gap-y-2">
            <span className="text-3xl font-extrabold tracking-widest gradient-text drop-shadow-lg select-none mb-2" style={{letterSpacing: '0.1em'}}>
              MFWORLD
            </span>
            <div className="text-gray-300 text-sm max-w-xs leading-relaxed text-center md:text-left">
              {biodata?.bio || 'Crafting digital experiences with passion and precision.'}
            </div>
          </div>

          {/* Kolom 2: Contact */}
          <div className="flex flex-col items-start gap-y-2">
            <div className="text-lg font-semibold text-white mb-2">Contact</div>
            <ul className="space-y-1 text-gray-400 text-sm mb-0">
              {biodata?.email && (
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> {biodata.email}</li>
              )}
              {biodata?.phone && (
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {biodata.phone}</li>
              )}
              {biodata?.location && (
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {biodata.location}</li>
              )}
            </ul>
          </div>

          {/* Kolom 3: Motto */}
          <div className="flex flex-col items-start gap-y-2 min-w-[110px]">
            <div className="text-lg font-semibold text-white mb-2">Motto</div>
            <div className="italic text-gray-400 text-sm text-center md:text-left whitespace-normal break-words truncate max-w-xs">
              {motto}
            </div>
          </div>

          {/* Kolom 4: Connect & Quick Links */}
          <div className="flex flex-col items-start md:items-end gap-y-4 md:pr-4">
            {/* Connect Section */}
            <div className="flex flex-col items-start md:items-end gap-y-2 w-full">
              <div className="text-lg font-semibold text-white mb-2 text-left md:text-right">Connect</div>
              <div className="flex items-center gap-4 mt-1">
                {socialLinks.length > 0 ? socialLinks.map((social) => {
                  const IconComponent = getIcon(social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-neon-cyan transition-colors text-xl"
                      title={social.platform}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                }) : (
                  <span className="text-gray-500 text-sm">No social links</span>
                )}
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="flex flex-col items-start md:items-end gap-y-2 w-full">
              <div className="text-lg font-semibold text-white mb-2 text-left md:text-right">Quick Links</div>
              <ul className="space-y-1 text-gray-400 text-sm mb-4 text-left md:text-right">
                <li><Link href="/#skills" className="hover:text-neon-cyan transition-colors">Skills</Link></li>
                <li><Link href="/#projects" className="hover:text-neon-cyan transition-colors">Projects</Link></li>
                <li><Link href="/#contact" className="hover:text-neon-cyan transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Garis pemisah */}
        <div className="border-t border-white/10 mt-10 mb-4"></div>
        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-4">
          © {currentYear} {biodata?.name || 'MFWORLD'}.
        </div>
      </div>
    </footer>
  );
} 