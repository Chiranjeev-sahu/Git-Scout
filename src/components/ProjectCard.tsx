import { ArrowUpRight, Circle, GitFork, Star } from "lucide-react";

export const ProjectCard = ({ project, featured = false }: { project: any, featured?: boolean }) => {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold uppercase ${featured ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'
            }`}>
            {project.title.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:underline decoration-1 underline-offset-4 decoration-zinc-500/50">
              {project.title}
            </h3>
            <p className={`text-xs ${featured ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {project.language}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1 ${featured ? 'text-zinc-400' : 'text-zinc-400'}`}>
          <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1" />
        </div>
      </div>

      <p className={`text-sm leading-relaxed ${featured ? 'text-zinc-300' : 'text-zinc-600'}`}>
        {project.description}
      </p>

      <div className="mt-auto pt-2 flex items-center justify-between border-t border-dashed border-opacity-10 border-gray-500">
        <div className="flex items-center gap-4 text-xs font-medium mt-3">
          <div className="flex items-center gap-1.5">
            <Circle size={10} className={`${project.color} fill-current`} />
            <span>{project.language}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={14} />
            <span>{project.stars}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork size={14} />
            <span>{project.forks}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3">
          {project.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full border ${featured
              ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
              : 'border-zinc-200 bg-zinc-50 text-zinc-500'
              }`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};