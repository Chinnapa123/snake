import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music2, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#050505] text-[#e0e0e0] font-sans grid grid-rows-[80px_1fr_100px] overflow-hidden selection:bg-[#00f2ff]/30">
      
      {/* Header */}
      <header className="border-b border-[#1a1a1a] flex justify-between items-center px-10 bg-gradient-to-b from-[#111] to-[#050505]">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-[#00f2ff]/5 rounded border border-[#00f2ff]/20 hidden md:block">
            <Zap className="text-[#00f2ff] w-5 h-5" />
          </div>
          <h1 className="font-mono text-2xl font-extrabold tracking-[4px] text-[#00f2ff] drop-shadow-[0_0_10px_rgba(0,242,255,0.5)] uppercase">
            Neon Beats
          </h1>
        </motion.div>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[#666666] font-mono uppercase tracking-[2px] text-[10px]"
        >
          Snake Game & AI Music Player
        </motion.p>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5 p-5 overflow-hidden">
        {/* Music Player Section */}
        <motion.section 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-5 flex flex-col overflow-y-auto"
        >
          <div className="flex items-center gap-3 mb-5 border-b border-[#1a1a1a] pb-2">
            <Music2 className="text-[#666666] w-4 h-4" />
            <h2 className="text-[12px] font-semibold text-[#666666] uppercase tracking-[2px]">Audio Terminal</h2>
          </div>
          <MusicPlayer />
        </motion.section>

        {/* Snake Game Section */}
        <motion.section 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-black border-2 border-[#1a1a1a] relative flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute top-5 left-5 flex items-center gap-3 z-10">
            <Gamepad2 className="text-[#666666] w-4 h-4" />
            <h2 className="text-[12px] font-semibold text-[#666666] uppercase tracking-[2px]">Gaming Matrix</h2>
          </div>
          <SnakeGame />
        </motion.section>

        {/* Right Panel (was footer info) */}
        <motion.section 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-5 flex flex-col"
        >
          <h2 className="text-[12px] font-semibold text-[#666666] uppercase tracking-[2px] mb-5 border-b border-[#1a1a1a] pb-2">
            System Status
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-2">
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">Latency</span>
              <span className="text-[13px] font-mono text-[#39ff14]">0.4ms</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-2">
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">Sync</span>
              <span className="text-[13px] font-mono text-[#00f2ff]">Active</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-2">
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-widest">Uptime</span>
              <span className="text-[13px] font-mono text-[#ff00ff]">99.9%</span>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer Info */}
      <footer className="bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center justify-center px-10">
        <p className="text-[#666666] text-[10px] font-mono uppercase tracking-[2px]">
          Built with React • Tailwind • Motion
        </p>
      </footer>
    </div>
  );
}
