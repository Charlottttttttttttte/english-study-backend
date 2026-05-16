import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

interface Props {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiCelebration({ trigger, onComplete }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={100}
      colors={['#C4956A', '#FFD166', '#4A8B6F', '#9BC53D', '#F5E6D3', '#C06C4A', '#E8D5F2']}
      recycle={false}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
    />
  );
}
