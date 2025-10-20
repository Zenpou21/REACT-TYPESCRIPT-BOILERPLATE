import { useState } from "react";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useEncryption from "../../hooks/useEncryption";
import SHARED_KEY from "../../globals/sharedKey";
import useCRUD from "../../hooks/useCRUD";
import { ThemeSwitcher } from "../../components/common/ThemeSwitcher";
import useCookie from "../../hooks/useCookie";

type TAuth = { email: string; password: string };

export default function Login() {
  const [formData, setFormData] = useState<TAuth>({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const { POST } = useCRUD();
  const { encryptData } = useEncryption(SHARED_KEY);
  const { setCookie } = useCookie();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return;
    setIsLoading(true);
    try {
      const result = await POST("login", formData);
      if (result?.access_token) {
        setCookie("accessToken", encryptData(result.access_token), {
          expiresInSeconds: 100000,
        });
        setCookie(
          "userDetails",
          encryptData(JSON.stringify(result.user_details))
        );

        navigate("../dashboard");
      } else {
        throw new Error(
          result?.message || "Invalid credentials or login failed"
        );
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Card disableAnimation className="w-96 2xl:w-full" fullWidth>
          <CardBody className="p-10 w-full py-10">
            <div className="font-body text-xl font-bold text-start mb-10 dark:text-default-600">
              Welcome Back!
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="font-body flex flex-col gap-y-5">
                <Input
                  disableAnimation
                  autoComplete="off"
                  size="md"
                  type="text"
                  name="email"
                  label="Email Address"
                  isRequired
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  disableAnimation
                  isRequired
                  autoComplete="off"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  endContent={
                    <button
                      tabIndex={0}
                      className="my-2"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
                <div className="flex justify-end">
                  <Link
                    to="../password/forgot"
                    className="text-primary text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  color="primary"
                  className="py-6 font-body"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
        <div className="text-[11px] text-gray-400 mt-8 font-body">
          © Copyright {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
      <div className="absolute z-40 right-5 bottom-3">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
