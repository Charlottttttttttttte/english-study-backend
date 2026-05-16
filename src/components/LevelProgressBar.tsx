import { motion } from 'framer-motion';

interface Props {
  current: number;
  completed: boolean[];
}

export default function LevelProgressBar({ current, completed }: Props) {
  const levels = [
    { num: 1, label: '听' },
    { num: 2, label: '核对' },
    { num: 3, label: '说' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {levels.map((l, i) => (
        <div key={l.num} className="flex items-center gap-2">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold ${
              completed[i]
                ? 'bg-cacao-gold text-jungle-deep'
                : current === l.num
                ? 'bg-cacao-gold/30 text-cacao-gold ring-2 ring-cacao-gold'
                : 'bg-white/10 text-white/70'
            }`}
            animate={current === l.num ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {completed[i] ? '✓' : l.num}
          </motion.div>
          <span className={`text-xs font-body ${current === l.num ? 'text-cacao-gold' : 'text-white/70'}`}>{l.label}</span>
          {i < 2 && (
            <div className={`w-8 h-0.5 ${completed[i] ? 'bg-cacao-gold' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
