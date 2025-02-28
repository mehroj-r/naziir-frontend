import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./Register.module.scss";
import { EmailIcon, LockIcon } from "../../assets/icons/loginRegisterIcons";
import { Center, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/auth.service";
import { customToast } from "../../utils/toastify";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/slices/userSlice";

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
  const password = watch("password");
  const dispatch = useDispatch();

  const handleGoogleSuccess = (response) => {
    console.log("Google sign-in successful:", response);
    if (response?.credential) {
      setIsLoading(true)
      const body = {
        idToken: response?.credential,
        organizationId: "285b0609-8656-4ecd-869f-67338f68dab5",
        role: "STUDENT"
      }
      
      authService.google(body)
        .then(res => {
          if (res?.data?.token) {
            customToast("success", "Successfully registered!")
            dispatch(userActions.setAuthorization({
              token: res?.data?.token,
              role: "STUDENT",
              userId: res?.data?.userId,
            }));
          }
        })
        .catch(err => {
          console.log("err", err) // log
          if (false) {
            customToast("error", err?.response?.data?.message);
          } else {
            customToast("error", "Something went wrong");
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  };

  const handleGoogleFailure = (error) => {
    console.log("Google sign-in failed:", error);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const body = {
      email: data?.email,
      password: data?.password,
      firstName: data?.firstName,
      lastName: data?.lastName,
    };
    authService.register(body)
      .then((res) => {
        if (res?.status == 200) {
          customToast("success", "User registered successfully", 3000);
          customToast("info", "Please confirm your email to log in", 3000);
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message == "Email address already in use!") {
          customToast("error", "Email address already in use!");
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              theme="outline"
              text="signup_with"
            />
          </div>

          <div className={styles.links}>
            <Link to="/login">Already have an account</Link>
          </div>
        </form>
      </Center>
    </div>
  );
}
