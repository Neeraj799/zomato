import { useState } from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setLoading(false);
      return setMessage("Please fill in both fields");
    }

    const formDataToSend = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:4000/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const { token } = data;
      localStorage.setItem("token", token);

      setMessage(data.message || "Logged in successfully");
      // Redirect to dashboard or home page
      // window.location.href = "/dashboard"; // example redirect
    } catch (error) {
      setMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>

      {message && <div className="text-sm text-red-500 mb-4">{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
