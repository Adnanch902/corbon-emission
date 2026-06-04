import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { login, setAuthTokens, signup } from "../lib/api";

export function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response =
        mode === "signup"
          ? await signup(name, email, password)
          : await login(email, password);
      setAuthTokens(response.accessToken || response.token, response.refreshToken);
      navigate("/input");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-2">{mode === "login" ? "Login" : "Create Account"}</h1>
        <p className="text-gray-600 mb-6">Access your GLIP profile and predictions.</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === "signup" && (
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <button className="text-emerald-700 font-medium" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </div>
        <Link className="block mt-4 text-sm text-emerald-700" to="/">
          Back to Home
        </Link>
      </Card>
    </div>
  );
}
