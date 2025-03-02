import { useForm } from "react-hook-form";
import styles from "./ForgotPassword.module.scss";
import {
  EmailIcon,
  LockIcon,
  ShieldIcon,
} from "../../assets/icons/loginRegisterIcons";
import { Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { authService } from "../../services/auth.service";
import { customToast } from "../../utils/toastify";

const headingMsg = [
  "Enter your email to get confirmation code",
  "Confirmation code has been sent to your email.",
  "Please, set a new password",
];

export default function ForgotPassword({ setIsForgotPassword }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const password = watch("password");

  const onSubmit = (data) => {
    setIsLoading(true);
    if (step == 1) {
      authService.forgotPassword(data?.email)
        .then((res) => {
          if (res?.data == "Password reset link has been sent to your email.") {
            customToast(
              "success",
              "Confirmation code has been sent to your email.",
              3000
            );
            setStep(2);
          }
        })
        .catch((err) => {
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (step == 2) {
      const body = {
        email: data?.email,
        code: data?.code,
      };
      authService.validateCode(body)
        .then((res) => {
          if (
            res?.data == "Reset code validated. You may now set a new password."
          ) {
            customToast(
              "success",
              "Reset code validated. You may now set a new password."
            );
            setStep(3);
          }
        })
        .catch((err) => {
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (step == 3) {
      const body = {
        code: data?.code,
        email: data?.email,
        password: data?.password,
      }
      authService.resetCode(body)
        .then(res => {
          if (res?.data == "Your password has been successfully reset.") {
            customToast(
              "success",
              "New password is set. You can now log in!"
            );
            setIsForgotPassword(false)
          }
        })
        .catch(err => {
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  };

  return (
    <div className={styles.forgotPassword}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 htmlFor="email">{headingMsg?.[step - 1]}</h2>
        <div className={styles.inputBox}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          <EmailIcon />
        </div>
        <p className={styles.error}>{errors.email?.message}</p>
        {step >= 2 && (
          <div className={`${styles.inputBox} ${styles.codeContainer}`}>
            <input
              type="number"
              id="code"
              placeholder="Confirm the code sent to your email"
              {...register("code", {
                required: "Confirmation code is required",
              })}
            />
            <ShieldIcon />
          </div>
        )}
        {step == 3 && (
          <>
            <div className={styles.inputBox}>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    pattern: (value) =>
                      /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])/.test(
                        value
                      ) ||
                      "At least one number, an uppercase letter, and a symbol",
                  },
                })}
              />
              <LockIcon />
              {errors.password && (
                <p className={`${styles.error} ${styles.visible}`}>
                  {errors?.password?.message}
                </p>
              )}
            </div>

            <div className={styles.inputBox}>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <LockIcon />
              {errors.confirmPassword && (
                <p className={`${styles.error} ${styles.visible}`}>
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
          </>
        )}
        <button className={styles.sendBtn}>
          {isLoading ? <Spinner borderWidth="3px" size="sm" /> : "Send"}
        </button>
      </form>
      <button
        onClick={() => setIsForgotPassword(false)}
        className={styles.backToLogIn}
      >
        Back to log in
      </button>
    </div>
  );
}
