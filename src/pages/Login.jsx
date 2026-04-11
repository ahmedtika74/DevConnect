import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Heading from "../components/ui/Heading";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const { error: supabaseError } = await signIn(email, password);
      if (supabaseError) throw supabaseError;
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout>
      <div className="flex w-full flex-1 items-center justify-center">
        <Form handleSubmit={handleLogin}>
          <Heading
            title="Welcome Back"
            desc="Continue your journey with your network"
          />
          <div className="mt-5 mb-10 flex flex-col gap-5 text-white">
            <Input
              label="EMAIL"
              type="email"
              placeholder="dev@connect.io"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e);
              }}
            />
            <Input
              label="PASSWORD"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => {
                setError("");
                setPassword(e);
              }}
            />
            <Button
              type="submit"
              className="btn-primary text-neutral py-3 font-black"
            >
              Sign In
            </Button>
          </div>
          <div className="text-center text-red-500">{error}</div>
          <div>
            <h3 className="text-text-secondary text-center">
              New to network?{" "}
              <Link to="/register" className="text-primary underline">
                Create Account
              </Link>
            </h3>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
}
