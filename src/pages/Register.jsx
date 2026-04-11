import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import AuthLayout from "../components/layout/AuthLayout";
import Form from "../components/ui/Form";
import Input from "../components/ui/Input";
import Heading from "../components/ui/Heading";
import Button from "../components/ui/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !username || !fullName) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const { data, error: signUpError } = await signUp(email, password);
      if (signUpError) throw signUpError;

      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, username, full_name: fullName }]);
      if (insertError) throw insertError;

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthLayout>
      <div className="flex w-full items-center justify-center">
        <Form handleSubmit={handleRegister}>
          <Heading
            title="New to DevConnect?"
            desc="Start your journey with us now"
          />
          <div className="mt-5 mb-10 flex flex-col gap-5 text-white">
            <Input
              label="FULL NAME"
              type="text"
              placeholder="Ahmed Fouad"
              value={fullName}
              onChange={setFullName}
            />
            <Input
              label="USERNAME"
              type="text"
              placeholder="@ahmedtika74"
              value={username}
              onChange={setUsername}
            />
            <Input
              label="EMAIL"
              type="email"
              placeholder="ahmed@gmail.com"
              value={email}
              onChange={setEmail}
            />
            <Input
              label="PASSWORD"
              type="password"
              placeholder="********"
              value={password}
              onChange={setPassword}
            />
            <Button
              type="submit"
              className="btn-primary text-neutral py-3 font-black"
            >
              Register
            </Button>
          </div>
          <div className="text-center text-red-500">{error}</div>
          <div>
            <h3 className="text-text-secondary text-center">
              Already a member?{" "}
              <Link to="/login" className="text-primary underline">
                Login Here
              </Link>
            </h3>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
}
