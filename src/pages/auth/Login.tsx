import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);

      await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#51463d]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#81766b]">
            Login to your ShopLite account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#5f554c]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-[#51463d] outline-none transition focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8] disabled:bg-[#f5f0ea]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#5f554c]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-[#51463d] outline-none transition focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8] disabled:bg-[#f5f0ea]"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#b45f3c] px-4 py-2.5 font-medium text-white transition hover:bg-[#9f5031] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#81766b]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#a65332] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;