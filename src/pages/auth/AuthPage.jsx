import { useEffect, useState } from "react";
import {
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LockKeyhole,
  UserRound,
  Sparkles,
  Heart,
  Eye,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { FaEyeSlash } from "react-icons/fa";

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function AuthPage({ mode = "login" }) {
  const { user, isAuthenticated, login, register, loading } =
    useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isAdminMode = location.pathname.startsWith("/admin");
  const finalMode = isAdminMode ? "admin-login" : mode;

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate(
        user.type === "model"
          ? "/admin"
          : "/model/amara_j",
        { replace: true }
      );
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (!loading && isAuthenticated && user) {
    return (
      <Navigate
        to={
          user.type === "model"
            ? "/admin"
            : "/model/amara_j"
        }
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      if (finalMode === "register") {
        await register(form);

        navigate("/model/amara_j", {
          replace: true,
        });

        return;
      }

      if (finalMode === "admin-login") {
        await login(
          {
            email: form.email,
            password: form.password,
          },
          "model"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      await login(
        {
          email: form.email,
          password: form.password,
        },
        "client"
      );

      navigate("/model/amara_j", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to sign in right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pageContent = {
    register: {
      eyebrow: "Create your account",
      title: "Your story begins here.",
      button: "Create account",
      panelEyebrow: "Begin your journey",
      panelTitle: "Step into something beautiful.",
    },

    "admin-login": {
      eyebrow: "Private studio",
      title: "Welcome back.",
      button: "Access dashboard",
      panelEyebrow: "Model studio",
      panelTitle: "Beauty, vision & every detail.",
    },

    login: {
      eyebrow: "Welcome back",
      title: "Lovely to see you.",
      button: "Sign in",
      panelEyebrow: "Private access",
      panelTitle: "A beautiful space, made for connection.",
    },
  };

  const content =
    pageContent[finalMode] || pageContent.login;

  return (
    <main className="relative h-screen max-h-screen overflow-hidden bg-[#fff8fb] text-[#4a2b42]">

      {/* =========================
          BACKGROUND
      ========================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-rose-100/70 blur-3xl" />

      {/* =========================
          MAIN WRAPPER
      ========================== */}

      <div className="relative z-10 flex h-full items-center justify-center px-3 py-3 sm:px-5 sm:py-4 lg:px-8">

        {/* =========================
            AUTH CARD
        ========================== */}

        <div className="grid h-[calc(100vh-1.5rem)] max-h-[760px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_25px_80px_rgba(157,91,132,0.18)] backdrop-blur-xl lg:h-[calc(100vh-2rem)] lg:grid-cols-[0.92fr_1.08fr]">

          {/* =====================================================
              LEFT FEMININE PANEL
          ====================================================== */}

          <div className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#f4b4d0_0%,#e7a5cc_38%,#b69ae2_100%)] lg:block">

            {/* Decorative circles */}

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/25" />

            <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-white/20" />

            <div className="absolute right-16 top-28 h-16 w-16 rounded-full border border-white/20" />

            <div className="absolute left-20 top-36 h-2 w-2 rounded-full bg-white/70" />

            <div className="absolute right-24 top-44 h-2.5 w-2.5 rounded-full bg-white/50" />

            <div className="absolute bottom-48 left-16 h-1.5 w-1.5 rounded-full bg-white/60" />

            {/* Soft light */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_30%)]" />

            {/* =========================
                CENTER ART
            ========================== */}

            <div className="absolute inset-x-0 top-[38%] flex -translate-y-1/2 items-center justify-center">

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md"
              >

                <div className="absolute inset-6 rounded-full border border-white/30" />

                <div className="absolute inset-12 rounded-full bg-white/15" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-[0_15px_40px_rgba(255,255,255,0.25)] backdrop-blur-md">

                  <Sparkles
                    size={23}
                    className="text-white"
                  />

                </div>

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-5 rounded-full border border-dashed border-white/30"
                />

              </motion.div>

            </div>

            {/* =========================
                LEFT BOTTOM TEXT
            ========================== */}

            <div className="absolute bottom-7 left-8 right-8 z-10">

              <p className="mb-3 text-[8px] font-medium uppercase tracking-[0.32em] text-white/75">
                {content.panelEyebrow}
              </p>

              <h1 className="max-w-sm font-serif text-4xl leading-[0.95] tracking-tight text-white xl:text-5xl">
                {content.panelTitle}
              </h1>

              <div className="mt-5 flex items-center gap-3">

                <div className="h-px w-9 bg-white/50" />

              </div>

            </div>

            {/* Side label */}

            <p className="absolute right-5 top-1/2 -translate-y-1/2 rotate-180 text-[7px] uppercase tracking-[0.3em] text-white/45 [writing-mode:vertical-rl]">
              Made with beauty in mind
            </p>

          </div>

          {/* =====================================================
              RIGHT FORM PANEL
          ====================================================== */}

          <div className="relative flex h-full items-center justify-center overflow-y-auto scrollbar-none bg-white/55 px-5 py-8 sm:px-8 lg:px-12 xl:px-16">

            {/* Decorative dots */}

            <div className="absolute right-6 top-6 flex items-center gap-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#d78bad]" />

              <span className="h-1.5 w-1.5 rounded-full bg-[#c7a1e8]" />

              <span className="h-1.5 w-1.5 rounded-full bg-[#f2b7cf]" />

            </div>

            {/* =========================
                FORM CONTENT
            ========================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-sm"
            >

              {/* =========================
                  HEADER
              ========================== */}

              <div className="mb-6">

                <div className="mb-4 flex items-center justify-between">

                  <span className="rounded-full bg-[#fff0f6] px-3 py-1.5 text-[7px] font-semibold uppercase tracking-[0.2em] text-[#b2678e]">
                    {finalMode === "register"
                      ? "New beginning"
                      : finalMode === "admin-login"
                        ? "Studio access"
                        : "Private access"}
                  </span>

                  <div className="flex items-center gap-1.5">

                    <LockKeyhole
                      size={10}
                      className="text-[#c186a6]"
                    />

                    <span className="text-[7px] uppercase tracking-[0.18em] text-[#b28b9f]">
                      Secure
                    </span>

                  </div>

                </div>

                {/* Icon */}

                <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ffd8e8,#e8d8ff)] shadow-[0_8px_20px_rgba(211,139,177,0.18)]">

                  <div className="absolute inset-1 rounded-[0.65rem] border border-white/60" />

                  <UserRound
                    className="relative h-4.5 w-4.5 stroke-[1.4] text-[#a35a80]"
                  />

                </div>

                <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#bd7d9d]">
                  {content.eyebrow}
                </p>

                <h2 className="font-serif text-3xl leading-none tracking-tight text-[#48233d] sm:text-4xl">
                  {content.title}
                </h2>

              </div>

              {/* =========================
                  FORM
              ========================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3.5"
              >

                {/* Name */}

                {finalMode === "register" && (
                  <FormInput
                    label="Full name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                )}

                {/* Phone */}

                {finalMode === "register" && (
                  <FormInput
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                  />
                )}

                {/* Email */}

                <FormInput
                  label="Email address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />

                {/* Password */}

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                />

                {/* Error */}

                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[11px] leading-4 text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  className="group relative mt-1 flex h-12 w-full items-center justify-between overflow-hidden rounded-xl bg-[linear-gradient(135deg,#e982ae_0%,#ca8bd8_55%,#9f8ee4_100%)] px-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(193,112,170,0.25)] transition-shadow hover:shadow-[0_16px_32px_rgba(193,112,170,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span className="relative z-10">
                    {submitting
                      ? "Please wait..."
                      : content.button}
                  </span>

                  <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">

                    <ArrowRight className="h-3.5 w-3.5" />

                  </span>

                  <div className="absolute inset-0 translate-x-[-100%] bg-white/10 transition-transform duration-700 group-hover:translate-x-[100%]" />

                </motion.button>

              </form>

              {/* =========================
                  SECURITY
              ========================== */}

              <div className="mt-5 flex items-center gap-2.5">

                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ebd4e1] to-transparent" />

                <div className="flex items-center gap-1.5 px-1">

                  <Heart
                    size={9}
                    className="fill-[#dda0bb] text-[#dda0bb]"
                  />

                  <p className="text-[7px] uppercase tracking-[0.16em] text-[#ad8297]">
                    Private & secure
                  </p>

                </div>

                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ebd4e1] to-transparent" />

              </div>

              {/* =========================
                  ACCOUNT LINK
              ========================== */}

              <div className="mt-4 text-center">

                {finalMode === "register" ? (
                  <p className="text-[11px] text-[#906a7e]">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-[#a65d83] transition hover:text-[#75405d]"
                    >
                      Welcome back
                    </Link>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#906a7e]">

                    {isAdminMode
                      ? "Looking for client access?"
                      : "New here?"}{" "}

                    <Link
                      to={
                        isAdminMode
                          ? "/login"
                          : "/register"
                      }
                      className="font-semibold text-[#a65d83] transition hover:text-[#75405d]"
                    >
                      {isAdminMode
                        ? "Client login"
                        : "Create an account"}
                    </Link>

                  </p>
                )}

              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}


/* =========================================================
   REUSABLE INPUT COMPONENT
========================================================= */

function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  setShowPassword,
  showPassword
}) {
  return (
    <div className="group relative">

      <label className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.2em] text-[#a6758d]">
        {label}
      </label>

      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="h-11 w-full rounded-xl border border-[#efdde7] bg-[#fffafd] px-3.5 text-xs text-[#4b2940] outline-none transition duration-300 placeholder:text-[#d5b7c6] focus:border-[#d990b3] focus:bg-white focus:shadow-[0_6px_20px_rgba(214,136,176,0.1)]"
      />

      {type === "password" && (
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((previous) => !previous)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-pink-300 transition-colors hover:text-pink-500 focus:outline-none"
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}