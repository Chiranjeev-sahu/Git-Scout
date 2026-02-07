import { motion } from 'framer-motion';
import { Search, Sparkles, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { Button } from '@/components/ui/button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import { Particles } from '@/components/ui/particles';
import { ShinyButton } from '@/components/ui/shiny-button';

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full bg-[#FBFCF8] overflow-hidden font-sans selection:bg-black selection:text-white">
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Search size={24} strokeWidth={3} />
          </div>
          <span className="text-xl font-black tracking-tighter">Git Scout</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/dashboard" className="hover:text-black transition-colors">
            Discover
          </Link>
          <Link
            to="/dashboard#trending"
            className="hover:text-black transition-colors"
          >
            Trending
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="font-bold">
            Log In
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            size="sm"
            className="bg-black text-white rounded-xs px-6 hover:bg-zinc-800 transition-all"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4">
        <AnimatedShinyText>Git-Scout v1 is now live</AnimatedShinyText>

        <div className="relative max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-sentient font-light tracking-tight leading-[0.9] mb-8 text-zinc-900"
          >
            Find your next <span className="italic font-medium pr-2">OSS</span>{' '}
            <br />
            <span className="relative inline-block">
              contribution in{' '}
              <LineShadowText className="italic tracking-tighter font-extralight">
                Seconds
              </LineShadowText>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-zinc-600 font-normal font-sans max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide"
          >
            Stop aimless scrolling. Instantly discover tailored open-source{' '}
            <span className="text-black font-medium">repositories</span> and{' '}
            <span className="text-black font-medium">issues</span> that fit your
            stack and experience level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <ShinyButton
              onClick={() => navigate('/dashboard')}
              className="h-12 px-10 bg-black text-white text-md font-bold shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Scouting
            </ShinyButton>

            <InteractiveHoverButton
              onClick={() => navigate('/dashboard#trending')}
            >
              View Trending
            </InteractiveHoverButton>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-1/2 left-10 opacity-20 hidden xl:block bg-white pointer-events-none"
        >
          <Star size={120} strokeWidth={0.2} className="rotate-12" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-10 opacity-20 bg-white hidden xl:block pointer-events-none"
        >
          <Sparkles size={160} strokeWidth={0.2} className="-rotate-12" />
        </motion.div>
      </main>
      <div className="absolute bg-linear-to-t from-blue-400 to-[#FBFCF8] h-screen z-0 w-full overflow-hidden">
        <Particles quantity={250} />
      </div>
    </div>
  );
};
