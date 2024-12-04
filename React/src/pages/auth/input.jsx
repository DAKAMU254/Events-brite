import React, { useContext, forwardRef } from "react";
import { OTPInput, OTPInputContext } from "input-otp";

const InputOTP = forwardRef(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={`d-flex align-items-center gap-2 ${
        containerClassName || ""
      }`}
      className={`${className || ""}`}
      {...props}
    />
  )
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`d-flex align-items-center ${className || ""}`}
    {...props}
  />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={`position-relative d-flex align-items-center justify-content-center border border-secondary text-center transition-all ${
        isActive ? "ring border-primary" : ""
      } ${className || ""}`}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "5px",
        outline: isActive ? "2px solid #0d6efd" : "none",
      }}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='position-absolute d-flex align-items-center justify-content-center w-100 h-100'>
          <div
            className='bg-dark'
            style={{
              width: "1px",
              height: "16px",
              animation: "blink 1s step-start infinite",
            }}
          />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";


export { InputOTP, InputOTPGroup, InputOTPSlot };
