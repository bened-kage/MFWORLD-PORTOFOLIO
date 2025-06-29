import { useQuery } from "@tanstack/react-query";
import GlassCard from "@/components/glass-card";
import { Calendar, ArrowRight } from "lucide-react";
import type { Article } from "@shared/schema";
import ParticleBackground from "@/components/particle-background";

export default function Articles() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan"></div>
          <p className="mt-4 text-slate-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="articles" className="min-h-screen pt-20 py-20 relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 gradient-text">Articles</h2>
        
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="glass-card rounded-2xl overflow-hidden group">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <span className="text-neon-cyan text-sm font-semibold">{article.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-neon-cyan transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {article.date}
                    </div>
                    <button className="text-neon-cyan hover:text-neon-green transition-colors flex items-center">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="glass-card rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-slate-400 mb-4">No Articles Available</h3>
              <p className="text-slate-500">
                Check back later for new articles and insights!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
