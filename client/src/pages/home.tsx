import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import GlassCard from "@/components/glass-card";
import SkillBar from "@/components/skill-bar";
import ClickableImage from "@/components/clickable-image";
import ParticleBackground from "@/components/particle-background";
import type { Biodata, Skill, Experience, Education, Activity, Project } from "@shared/schema";

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

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  useEffect(() => {
    // Add floating animation delay for multiple elements
    const floatingElements = document.querySelectorAll('.floating-animation');
    floatingElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <div id="home" className="min-h-screen pt-20 relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center py-20 flex flex-col items-center justify-center">
          <div className="floating-animation mb-8 flex items-center justify-center">
            {/* Profile Image Container with better styling */}
            <div className="profile-image-container rounded-full overflow-hidden w-40 md:w-48 h-40 md:h-48 flex items-center justify-center">
              {/* Profile image with enhanced styling */}
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-full aspect-square w-full h-full overflow-hidden flex items-center justify-center">
                <ClickableImage
                  src={biodata?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
              alt="Professional headshot"
                  className="border-4 border-gray-700/50 shadow-2xl profile-image-glow object-cover"
                  width="w-full"
                  height="h-full"
                  rounded="full"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {biodata?.name || "Loading..."}
          </h1>
          <p className="text-xl md:text-2xl mb-8 gradient-text font-semibold">
            {biodata?.title || "Full Stack Developer"}
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
              <div className="col-span-full text-center text-gray-400">
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
                  <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-6">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-green-500 mb-3">{exp.position}</h3>
                        <h4 className="text-lg font-semibold mb-3">{exp.company}</h4>
                        <div className="text-gray-400 text-sm mb-3">{exp.duration}</div>
                        <p className="text-gray-300">{exp.description}</p>
                      </div>
                    </div>
                    {exp.image && (
                      <div className="flex-shrink-0 flex items-end md:items-center justify-end">
                        <ClickableImage
                          src={exp.image}
                          alt={exp.position}
                          className="ml-4"
                          width="w-32 md:w-48"
                          height="h-32 md:h-48"
                          rounded="lg"
                        />
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="text-center text-gray-400">
                No experience data available
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div id="projects" className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map((project) => (
                <GlassCard key={project.id} className="flex flex-col h-full">
                  {project.image && (
                    <div className="mb-4 flex justify-center">
                      <ClickableImage
                        src={project.image}
                        alt={project.title}
                        width="w-32 md:w-48"
                        height="h-32 md:h-48"
                        rounded="lg"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-green-500 mb-2">{project.title}</h3>
                  <div className="text-gray-400 text-sm mb-2">{project.year}</div>
                  <p className="text-gray-300 mb-2 flex-1">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline text-sm">View Project</a>
                  )}
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No projects data available
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
                  <h3 className="text-xl font-bold text-green-500 mb-2">{edu.degree}</h3>
                  <p className="text-lg font-semibold mb-2">{edu.institution}</p>
                  <p className="text-gray-400">{edu.year}</p>
                  {edu.description && (
                    <p className="text-gray-300 mt-2">{edu.description}</p>
                  )}
                </GlassCard>
              ))
            ) : (
              <div className="text-center text-gray-400">
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
                  <div className="flex flex-row items-center justify-between gap-6 h-full">
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                      <p className="text-gray-300">{activity.description}</p>
                    </div>
                    {activity.image && (
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <ClickableImage
                          src={activity.image}
                          alt={activity.title}
                          width="w-24 md:w-32"
                          height="h-24 md:h-32"
                          rounded="lg"
                        />
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400">
                No activities data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
