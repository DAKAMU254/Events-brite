import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert2";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);

      SweetAlert.fire("Success", "Logged in successfully!", "success").then(
        () => {
          navigate("/");
        }
      );
    } catch (err) {
      SweetAlert.fire("Error", err.message || "Login failed", "error");
    }
  };

  return (
    <div className='container col-xl-10 col-xxl-8 px-4 py-5'>
      <div className='row align-items-center g-lg-5 py-5'>
        <div className='col-lg-7 text-center text-lg-start'>
          <h2 className='display-4 fw-bold lh-1 mb-3'>
            Welcome back <span className='text-info'>Friend</span>
          </h2>
          <p className='col-lg-10 fs-4'>
            Please login to continue your experience.
          </p>
        </div>
        <div className='col-md-10 mx-auto col-lg-5'>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className='p-4 p-md-5 border rounded-3 bg-light'
          >
            <div className='form-floating mb-3'>
              <input
                type='email'
                {...register("email")}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id='floatingInput'
                placeholder='name@example.com'
              />
              <label htmlFor='floatingInput'>Email address</label>
              {errors.email && (
                <div className='invalid-feedback'>{errors.email.message}</div>
              )}
            </div>

            <div className='form-floating mb-3'>
              <input
                type='password'
                {...register("password")}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id='floatingPassword'
                placeholder='Password'
              />
              <label htmlFor='floatingPassword'>Password</label>
              {errors.password && (
                <div className='invalid-feedback'>
                  {errors.password.message}
                </div>
              )}
            </div>

            <button className='w-100 btn btn-lg btn-info' type='submit'>
              Log In
            </button>
            <hr className='my-4' />
            <small className='text-muted'>
              Don't have an account? <a href='/signup'>Sign up</a>
            </small>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

