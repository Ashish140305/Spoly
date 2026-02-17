import React, { useState, Children, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Step = ({ children }) => {
  return <div className="w-full h-full flex flex-col items-center justify-center px-4">{children}</div>;
};

const Stepper = ({
  step = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next",
  children
}) => {
  const [currentStep, setCurrentStep] = useState(step);
  const [direction, setDirection] = useState(1); 

  useEffect(() => {
    if (step > currentStep) setDirection(1);
    else if (step < currentStep) setDirection(-1);
    setCurrentStep(step);
  }, [step]);

  const steps = Children.toArray(children);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) onStepChange(nextStep);
    } else {
      if (onFinalStepCompleted) onFinalStepCompleted();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onStepChange) onStepChange(prevStep);
    }
  };

  const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

  return (
    <div className="w-full mx-auto flex flex-col relative z-10 bg-white/60 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-2xl rounded-[3rem] p-8 md:p-14 transition-colors duration-500">
      
      {/* --- Step Indicator / Progress Bar --- */}
      <div className="relative flex w-full justify-between items-center mb-12 px-2 md:px-8">
        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full -translate-y-1/2 -z-20" />
        <motion.div 
          className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full -translate-y-1/2 -z-10"
          initial={{ width: 0 }}
          animate={{ width: progressWidth }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={stepNumber} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center font-extrabold text-base md:text-lg shadow-sm transition-colors duration-300 ${
                  isActive || isCompleted 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : ( stepNumber )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* --- Step Content Container --- */}
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[220px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col items-center justify-center"
          >
            {steps[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Navigation Controls --- */}
      <div className="flex justify-between items-center w-full mt-10 px-2">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
            currentStep === 1 ? 'opacity-0 cursor-default pointer-events-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
          }`}
        >
          &larr; {backButtonText}
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          {currentStep === totalSteps ? 'Finish Setup' : nextButtonText} {currentStep !== totalSteps && <span>&rarr;</span>}
        </motion.button>
      </div>
    </div>
  );
};

export default Stepper;