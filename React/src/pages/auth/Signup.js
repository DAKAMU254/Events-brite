import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input.jsx";

const signupSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [otpValue, setOtpValue] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const navigator = useNavigate();
  const { signup, verifyToken, resendOtp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleStepOneSubmit = async (data) => {
    try {
      const response = await signup(
        `${data.firstname} ${data.lastname}`,
        data.email,
        data.password
      );
      console.log(response);
      if (response.ok) {
        setUserData(data);
        setStep(2);
      } else {
        console.error("Signup failed:", response);
     
      }
    } catch (error) {
      console.error("Error during signup:", error);
      
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await verifyToken(userData.email, otpValue);
      if (response.ok) {
        navigator("/");
      } else {
        console.error("OTP verification failed:", response);
       
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp(userData.email);
      if (response.ok) {
        setResendTimer(30); 
      } else {
        console.error("Failed to resend OTP:", response);
      
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div className='container col-xl-10 col-xxl-8 px-4 py-5'>
          <div className='row align-items-center g-lg-5 py-5'>
            <div className='col-lg-7 text-center text-lg-start'>
              <h1 className='display-4 fw-bold lh-1 mb-3'>
                Be Part of our <span className='text-info'>Family</span>
              </h1>
              <p className='col-lg-10 fs-4'>
                Your details are guaranteed to be protected and will not be
                altered by third-party applications
              </p>
            </div>
            <div className='col-md-10 mx-auto col-lg-5'>
              <form
                className='p-4 p-md-5 border rounded-3 bg-light'
                onSubmit={handleSubmit(handleStepOneSubmit)}
              >
                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    {...register("firstname")}
                    className={`form-control ${
                      errors.firstname ? "is-invalid" : ""
                    }`}
                    placeholder='First Name'
                  />
                  <label htmlFor='firstname'>First Name</label>
                  {errors.firstname && (
                    <div className='invalid-feedback'>
                      {errors.firstname.message}
                    </div>
                  )}
                </div>

                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    {...register("lastname")}
                    className={`form-control ${
                      errors.lastname ? "is-invalid" : ""
                    }`}
                    placeholder='Last Name'
                  />
                  <label htmlFor='lastname'>Last Name</label>
                  {errors.lastname && (
                    <div className='invalid-feedback'>
                      {errors.lastname.message}
                    </div>
                  )}
                </div>

                <div className='form-floating mb-3'>
                  <input
                    type='email'
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder='name@example.com'
                  />
                  <label htmlFor='email'>Email address</label>
                  {errors.email && (
                    <div className='invalid-feedback'>
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className='form-floating mb-3'>
                  <input
                    type='password'
                    {...register("password")}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder='Password'
                  />
                  <label htmlFor='password'>Password</label>
                  {errors.password && (
                    <div className='invalid-feedback'>
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <button className='w-100 btn btn-lg btn-info' type='submit'>
                  Next
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className='container col-xl-10 col-xxl-8 px-4 py-5'>
          <div className='row align-items-center g-lg-5 py-5'>
            <div className='col-md-10 mx-auto col-lg-5'>
              <div className='p-4 p-md-5 border rounded-3 bg-light text-center'>
                <h1 className='mb-3'>Verify your email</h1>
                <p className='mb-4'>
                  Enter the verification code sent to your email ID
                </p>

                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <p className='text-muted mt-3'>
                  Didn’t receive a code?{" "}
                  {resendTimer > 0 ? (
                    <span>({resendTimer}s)</span>
                  ) : (
                    <button onClick={handleResendOtp} className='btn btn-link'>
                      Resend OTP
                    </button>
                  )}
                </p>
                <button
                  className='w-100 btn btn-lg btn-info mt-3'
                  onClick={handleOtpSubmit}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
