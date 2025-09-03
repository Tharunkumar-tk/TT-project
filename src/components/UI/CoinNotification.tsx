import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinNotificationProps {
  amount: number;
  onComplete: () => void;
}

const CoinNotification: React.FC<CoinNotificationProps> = ({ amount, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl shadow-2xl border border-yellow-400"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-2xl"
            >
              🪙
            </motion.div>
            <div>
              <div className="font-bold text-lg">+{amount} Coins!</div>
              <div className="text-yellow-100 text-sm">Added to your wallet</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoinNotification;