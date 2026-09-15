import { ReactNode } from "react";
import { motion } from "framer-motion";

interface InsightSlideProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const InsightSlide = ({ title, subtitle, children }: InsightSlideProps) => {
  return (
    <div className="min-h-full flex flex-col py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 text-center"
      >
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm px-2">{subtitle}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex-1 flex flex-col justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};
