import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Register.module.scss";
import { EmailIcon, LockIcon } from "../../assets/icons/loginRegisterIcons";
import { Center, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/auth.service";
import { customToast } from "../../utils/toastify";

export default function RegisterPage() {
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
  const [successMessage, setSuccessMessage] = useState(false);
  const password = watch("password");

  const handleGoogleSuccess = (response) => {
    console.log("Google sign-in successful:", response);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google sign-in failed:", error);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const body = {
      email: data?.email,
      password: data?.password,
      firstName: data?.firstName,
      lastName: data?.lastName,
    };
    authService
      .register(body)
      .then((res) => {
        if (res?.status == 200) {
          customToast("success", "User registered successfully", 3000);
          customToast("info", "Please confirm your email to log in", 3000);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message == "Email address already in use!") {
          customToast("error", "Email address already in use!");
        } else if (!navigator?.online) {
          customToast("error", "No connection to the internet");
        } else {
          customToast("error", "Something went wrong");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.gradient}>
        <p>
          Welcome.
          <br />
          Start your journey now with our quiz app!
        </p>
      </div>
      <Center className={styles.right}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.heading}>Register</h1>

          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName", {
                required: "First Name is required",
                minLength: {
                  value: 2,
                  message: "First Name must be at least 2 characters",
                },
              })}
            />
            {errors.firstName && (
              <p className={`${styles.error} ${styles.visible}`}>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName", {
                required: "Last Name is required",
                minLength: {
                  value: 2,
                  message: "Last Name must be at least 2 characters",
                },
              })}
            />
            {errors.lastName && (
              <p className={`${styles.error} ${styles.visible}`}>
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className={styles.inputBox}>
            <input
              type="email"
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
            {errors.email && (
              <p className={`${styles.error} ${styles.visible}`}>
                {errors.email.message}
              </p>
            )}
          </div>

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
                {errors.password.message}
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
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={!isValid || isLoading}
          >
            {isLoading ? <Spinner borderWidth="3px" size="sm" /> : "Register"}
          </button>

          <div className={styles.googleBtnContainer}>
            <GoogleOAuthProvider clientId="26408612225-5cfkg5k83sfmv954ukl2kkb8nlktr9a1.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap
                theme="outline"
                text="signup_with"
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className={styles.googleButton}
                  >
                    Sign up with Google
                  </button>
                )}
              />
            </GoogleOAuthProvider>
          </div>

          <div className={styles.links}>
            <Link to="/login">Already have an account</Link>
          </div>
        </form>
      </Center>

      {successMessage && (
        <div className={styles.successMessage}>Successfully registered ✅</div>
      )}
    </div>
  );
}
