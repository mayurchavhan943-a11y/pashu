import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    userType: "Farmer",
    state: "",
    district: ""
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      // Map frontend fields to typical backend fields if necessary
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.userType.toUpperCase(),
        state: formData.state,
        district: formData.district
      };
      const userData = await register(payload);
      if (userData?.role === 'ADMIN' || userData?.roles?.includes('ADMIN')) {
          navigate("/admin/dashboard");
      } else if (userData?.role === 'VETERINARIAN' || userData?.role === 'VET' || userData?.roles?.includes('VETERINARIAN')) {
          navigate("/vet/dashboard");
      } else {
          navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to register.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-critical-50 p-3 text-sm text-critical-600">
            {error}
          </div>
        )}
        
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Mobile Number"
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <Select
          label="User Type"
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          options={[
            { value: "Farmer", label: "Farmer" },
            { value: "Pet Owner", label: "Pet Owner" }
          ]}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </div>
  );
}