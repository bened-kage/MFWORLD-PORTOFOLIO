import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import GlassCard from "@/components/glass-card";
import SkillBar from "@/components/skill-bar";
import type { Biodata, Skill, Experience, Education, Activity } from "@shared/schema";

export default function Home() {
  const { data: biodata } = useQuery<Biodata>({
    queryKey: ["/api/biodata"],
  });

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  const { data: education = [] } = useQuery<Education[]>({
    queryKey: ["/api/education"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  useEffect(() => {
    // Add floating animation delay for multiple elements
    const floatingElements = document.querySelectorAll('.floating-animation');
    floatingElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <div id="home" className="min-h-screen pt-20">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="floating-animation">
            <img
              src={biodata?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
              alt="Professional headshot"
              className="w-32 h-32 rounded-full mx-auto mb-8 glass-effect p-2"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {biodata?.name || "Loading..."}
          </h1>
          <p className="text-xl md:text-2xl mb-8 gradient-text font-semibold">
            {biodata?.title || "Full Stack Developer"}
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {biodata?.bio || "Passionate developer creating modern web applications with cutting-edge technologies."}
          </p>
        </div>

        {/* Skills Section */}
        <div id="skills" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <SkillBar
                  key={skill.id}
                  name={skill.name}
                  level={skill.level}
                  percentage={skill.percentage}
                  icon={skill.icon}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400">
                No skills data available
              </div>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div id="experience" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Experience</h2>
          <div className="max-w-4xl mx-auto">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <GlassCard key={exp.id} className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-neon-cyan">{exp.position}</h3>
                    <span className="text-slate-400">{exp.duration}</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-4">{exp.company}</h4>
                  <p className="text-slate-300">{exp.description}</p>
                </GlassCard>
              ))
            ) : (
              <div className="text-center text-slate-400">
                No experience data available
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div id="education" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Education</h2>
          <div className="max-w-2xl mx-auto">
            {education.length > 0 ? (
              education.map((edu) => (
                <GlassCard key={edu.id} className="mb-6">
                  <h3 className="text-xl font-bold text-neon-cyan mb-2">{edu.degree}</h3>
                  <p className="text-lg font-semibold mb-2">{edu.institution}</p>
                  <p className="text-slate-400">{edu.year}</p>
                  {edu.description && (
                    <p className="text-slate-300 mt-2">{edu.description}</p>
                  )}
                </GlassCard>
              ))
            ) : (
              <div className="text-center text-slate-400">
                No education data available
              </div>
            )}
          </div>
        </div>

        {/* Activities Section */}
        <div id="activities" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <GlassCard key={activity.id}>
                  <i className={`${activity.icon} text-3xl text-neon-cyan mb-4`}></i>
                  <h3 className="text-xl font-semibold mb-3">{activity.title}</h3>
                  <p className="text-slate-300">{activity.description}</p>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-400">
                No activities data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
