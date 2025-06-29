import { Instagram, MessageCircle, Linkedin, Github, Twitter, Facebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SocialLink } from "@shared/schema";

export default function FooterMinimal() {
  const currentYear = new Date().getFullYear();

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links"],
  });

  // Icon mapping for different platforms
  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'instagram':
        return Instagram;
      case 'whatsapp':
        return MessageCircle;
      case 'linkedin':
        return Linkedin;
      case 'github':
        return Github;
      case 'twitter':
        return Twitter;
      case 'facebook':
        return Facebook;
      default:
        return MessageCircle;
    }
  };

  return (
    <footer className="mt-20 border-t border-gray-800/30">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-lg font-semibold gradient-text">
              MFWORLD
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const IconComponent = getIcon(social.platform);
                
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-neon-cyan transition-colors duration-200"
                    title={social.platform}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              © {currentYear} MFWORLD
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 