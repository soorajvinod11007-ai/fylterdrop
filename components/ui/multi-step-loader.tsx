"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
      aria-hidden="true"
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={index}
            className="flex items-center gap-3 py-2 text-left"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -(value * 40) }}
            animate={{ opacity, y: shouldReduceMotion ? 0 : -(value * 40) }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <div>
              {index > value && (
                <CheckIcon className="h-5 w-5 text-stone-400" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "h-5 w-5 text-fylter-gold",
                    value === index && "opacity-100",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium text-stone-500",
                value === index && "text-fylter-dark",
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-fylter-offWhite/95 px-6 backdrop-blur-xl"
          aria-busy="true"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(208,177,118,0.18),transparent_65%)]"
          />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-10 text-center">
              <p className="font-heading text-4xl font-semibold tracking-[0.18em] text-fylter-dark">
                FYLTER
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-fylter-secondary">
                Little finds, big happy
              </p>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {loadingStates[currentState]?.text ?? "Loading the Fylter store"}
            </p>
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
