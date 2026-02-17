import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BubbleMenu = ({
  logo,
  items,
  menuAriaLabel = "Toggle navigation",
  menuBg = "#ffffff",
  menuContentColor = "#111111",
  useFixedPosition = false,
  animationEase = "back.out(1.5)", 
  animationDuration = 0.5,
  staggerDelay = 0.12,
  initialOpen = false // Added initialOpen prop
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen); // Initialized with prop
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const easeCurve = typeof animationEase === 'string' && animationEase.includes('back') 
    ? [0.34, 1.56, 0.64, 1] 
    : [0.25, 1, 0.5, 1];

  return (
    <div className={`relative ${useFixedPosition ? 'fixed z-[100] top-4 left-4' : 'z-50'}`}>
      <motion.div
        initial={false}
        animate={{
          backgroundColor: menuBg,
          color: menuContentColor,
          borderRadius: isOpen ? '40px' : '20px',
          padding: isOpen ? '8px 12px' : '0px',
        }}
        transition={{ duration: animationDuration, ease: easeCurve }}
        className="flex items-center shadow-lg border border-slate-200/50 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Logo / Toggle Trigger */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          aria-label={menuAriaLabel}
          className={`cursor-pointer flex items-center justify-center shrink-0 z-20 ${
            isOpen ? 'pl-2 pr-4 border-r border-slate-300/30' : 'p-2'
          }`}
        >
          {logo}
        </div>

        {/* Expanding Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: animationDuration, ease: easeCurve }}
              className="flex items-center gap-1 overflow-hidden whitespace-nowrap pl-3"
            >
              {items.map((item, index) => {
                const isHovered = hoveredIndex === index;
                
                return (
                  <motion.a
                    key={item.label}
                    href={item.href || '#'}
                    aria-label={item.ariaLabel}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                    }}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    transition={{ 
                      delay: isOpen ? index * staggerDelay : 0, 
                      duration: 0.4, 
                      ease: easeCurve 
                    }}
                    className="relative px-5 py-2 mx-1 rounded-full font-bold text-sm tracking-wide capitalize transition-colors duration-300 inline-flex items-center justify-center outline-none cursor-pointer"
                  >
                    {/* Hover Background Blob */}
                    <motion.span
                      animate={{
                        rotate: isHovered ? item.rotation : 0,
                        scale: isHovered ? 1.05 : 1,
                        backgroundColor: isHovered && item.hoverStyles ? item.hoverStyles.bgColor : 'transparent',
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full w-full h-full -z-10"
                    />
                    
                    {/* Inner Text */}
                    <motion.span
                       animate={{
                        color: isHovered && item.hoverStyles ? item.hoverStyles.textColor : menuContentColor,
                      }}
                      transition={{ duration: 0.2 }}
                      className="z-10"
                    >
                       {item.label}
                    </motion.span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BubbleMenu;