import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useModels } from "../context/ModelContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { getDefaultModel } = useModels();

  const [modelUsername, setModelUsername] = useState("");

  useEffect(() => {
    const loadDefaultModel = async () => {
      try {
        const model = await getDefaultModel();

        if (model?.username) {
          setModelUsername(model.username);
        }
      } catch (error) {
        console.error("Failed to load default model:", error);
      }
    };

    loadDefaultModel();
  }, [getDefaultModel]);

  const handleViewProfile = () => {
    if (!modelUsername) {
      navigate("/login");
      return;
    }

    navigate(`/model/${modelUsername}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff8fc] text-[#32152f]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-200/30 blur-3xl" />

        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[12%] top-[18%] h-20 w-20 rounded-full border border-pink-200/60"
        />

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[18%] left-[12%] h-12 w-12 rounded-full border border-fuchsia-200/60"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">

          {/* Small label */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-pink-500"
          >
            Page not found
          </motion.p>

          {/* 404 */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="select-none bg-gradient-to-br from-pink-300 via-pink-500 to-fuchsia-500 bg-clip-text text-[clamp(7rem,25vw,16rem)] font-black leading-[0.75] tracking-[-0.08em] text-transparent"
            >
              404
            </motion.h1>

            {/* Decorative text */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.5em] text-white/90"
            >
              Lost in the moment
            </motion.span>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
            }}
            className="mx-auto mt-12 max-w-md"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-[#32152f] sm:text-3xl">
              This page slipped away.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#32152f]/60 sm:text-base">
              The page you're looking for doesn't exist or may have moved.
              Let's get you back to somewhere beautiful.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.7,
            }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3.5 text-sm font-medium text-[#32152f] shadow-sm transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:shadow-md sm:w-auto"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Go back
            </button>

            <button
              type="button"
              onClick={handleViewProfile}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 sm:w-auto"
            >
              <Home size={17} />

              View Profile
            </button>
          </motion.div>

          {/* Bottom detail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 1,
            }}
            className="mt-16 flex items-center justify-center gap-3"
          >
            <span className="h-px w-10 bg-pink-200" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-pink-300">
              404 / Portfolio
            </span>

            <span className="h-px w-10 bg-pink-200" />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;