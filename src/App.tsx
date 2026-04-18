/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Binary, Eye, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-cyber-black text-neon-cyan selection:bg-neon-magenta selection:text-black overflow-x-hidden relative">
      {/* GLITCH OVERLAYS */}
      <div className="static-noise" />
      <div className="crt-lines" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* HEADER_CORE */}
        <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 border-b-4 border-neon-cyan pb-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 border-4 border-neon-magenta bg-cyber-black glitch-text" data-text="01">
                <Cpu size={32} className="text-neon-magenta" />
              </div>
              <h1 className="text-4xl font-pixel leading-none tracking-tighter glitch-text" data-text="EPHRAIM::GRID_REMIX">
                EPHRAIM::GRID_REMIX
              </h1>
            </div>
            <p className="font-mono text-[10px] text-neon-magenta uppercase tracking-[6px] ml-16 bg-white/5 inline-block px-2">
              SESSION_INIT::AUTHORIZED // KERNEL_v4.4.0
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4 font-mono text-[8px] text-gray-500 uppercase"
          >
             <div className="flex flex-col items-end border-r border-gray-800 pr-4">
               <span className="text-neon-cyan flex items-center gap-1"><Binary size={8} />BIT_STREAM::ON</span>
               <span>PKT_LOSS::0.00%</span>
               <span>CRYPT_MODE::AES_256</span>
             </div>
             <div className="flex flex-col">
               <span className="text-neon-magenta flex items-center gap-1"><Database size={8} />DB_SYNC::LIVE</span>
               <span>MEM_LOAD::42%</span>
               <span>UPLINK::STABLE</span>
             </div>
          </motion.div>
        </header>

        {/* MAIN_GRID_INTERFACE */}
        <main className="space-y-12">
          
          {/* PRIMARY_EXECUTION_ARRAY */}
          <section className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-[480px] bg-cyber-gray/20 p-4 pixel-border relative"
            >
              <div className="absolute -top-3 left-4 bg-cyber-black px-2 text-[10px] font-pixel text-neon-magenta">
                EXEC_WINDOW_00
              </div>
              <div className="absolute top-2 right-2 text-neon-cyan opacity-20">
                <Eye size={12} />
              </div>
              <SnakeGame />
            </motion.div>
          </section>

          {/* AUDIO_SUBSYSTEM_PANEL */}
          <section className="w-full max-w-4xl mx-auto">
             <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
             >
                <div className="absolute -top-3 right-8 bg-cyber-black px-2 text-[10px] font-pixel text-neon-cyan z-10">
                  DECODE_UNIT_01
                </div>
                <MusicPlayer />
             </motion.div>
          </section>

        </main>

        <footer className="mt-24 pt-8 border-t-2 border-neon-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[9px] text-gray-600 uppercase">
          <div className="flex items-center gap-4">
            <span className="text-neon-cyan">MACHINEID::EP77_SNKE</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full" />
            <span>LOC::SECTOR_7G</span>
          </div>
          <p>TERMINATE_SESSION // [CTRL]+[C]</p>
          <div className="flex gap-4 text-neon-magenta">
            <span className="cursor-crosshair border-b border-transparent hover:border-neon-magenta">PROTOCOL</span>
            <span className="cursor-crosshair border-b border-transparent hover:border-neon-magenta">ARCHIVE</span>
            <span className="cursor-crosshair border-b border-transparent hover:border-neon-magenta">VOID</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
