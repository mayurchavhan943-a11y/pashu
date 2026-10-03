import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userData = await login(email.trim(), password);
      if (userData) {
        if (userData.role === 'ADMIN' || userData.roles?.includes('ADMIN')) {
          navigate("/admin/dashboard");
        } else if (userData.role === 'VETERINARIAN' || userData.role === 'VET' || userData.roles?.includes('VETERINARIAN')) {
          navigate("/vet/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const responseData = err?.response?.data;
      if (responseData?.errors && typeof responseData.errors === 'object') {
        setError(Object.values(responseData.errors).join(", "));
      } else if (responseData?.message) {
        setError(responseData.message);
      } else {
        setError(t('auth.loginFailed', "Failed to login. Please check your credentials."));
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-critical-50 p-3 text-sm text-critical-600">
            {error}
          </div>
        )}
        
        <Input
          label={t('auth.emailLabel', 'Email Address')}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder', 'farmer@example.com')}
          required
        />
        
        <Input
          label={t('auth.passwordLabel', 'Password')}
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.passwordPlaceholder', '••••••••')}
          required
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
              {t('auth.rememberMe', 'Remember me')}
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              {t('auth.forgotPassword', 'Forgot your password?')}
            </a>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.signingIn', 'Signing in...') : t('auth.signInButton', 'Sign in')}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-600">
        {t('auth.dontHaveAccount', "Don't have an account?")}{" "}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
          {t('auth.createOneNow', 'Create one now')}
        </Link>
      </div>
    </div>
  );
}