import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface Props {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = '返回' }: Props) {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-2 text-white/90 hover:text-cacao-gold transition-colors font-body text-sm mb-4"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft size={18} />
      {label}
    </motion.button>
  );
}
