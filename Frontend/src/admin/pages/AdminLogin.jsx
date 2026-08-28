import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await adminLogin({
        email,
        password,
      });

      console.log("ADMIN LOGIN RESPONSE:", response);

      /*
       * Laravel API response handle karne ke liye
       *
       * Possible responses:
       *
       * {
       *   success: true,
       *   data: {
       *      token: "..."
       *   }
       * }
       *
       * OR
       *
       * {
       *   success: true,
       *   token: "..."
       * }
       */

      const token =
        response?.data?.token ||
        response?.token ||
        response?.data?.access_token;

      if (!token) {
        throw new Error("Login successful but token was not received.");
      }

      // Token browser mein save karo
      localStorage.setItem("admin_token", token);

      // Dashboard par jao
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg">
            <ShieldCheck size={26} strokeWidth={1.5} />
          </div>

          <h1 className="font-serif text-3xl tracking-[0.15em]">
            ESTE<span className="tracking-normal">L</span>E
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-500">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-9">
          <div className="mb-7">
            <h2 className="text-xl font-medium text-gray-900">Welcome Back</h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to manage your Estele store.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.5} />
                  ) : (
                    <Eye size={18} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Estele Admin Panel
        </p>
      </div>
    </div>
  );
}
