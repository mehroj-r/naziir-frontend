import styles from "./LoginPage.module.scss";
import { EmailIcon, LockIcon } from "../../assets/icons/loginRegisterIcons";
import { Center, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { customToast } from "../../utils/toastify";
import { userActions } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import ForgotPassword from "../../components/ForgotPassword";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data) => {
    const body = {
      email: data?.email,
      password: data?.password,
      role: "ADMIN"
    };

    setIsLoading(true);
    authService
      .login(body)
      .then((res) => {
        if (res?.data?.token) {
          customToast("success", "Successfully logged in!");
          dispatch(userActions.setToken(res?.data?.token));
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          customToast("error", err?.response?.data?.message);
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

  const handleGoogleSuccess = (response) => {
    console.log("Google sign-in successful:", response);
    if (response?.credential) {
      setIsLoading(true)
      const body = {
        idToken: response?.credential,
        role: "STUDENT"
      }
      
      authService.google(body)
        .then(res => {
          if (res?.data?.token) {
            customToast("success", "Successfully logged in!")
            dispatch(userActions.setToken(res?.data?.token));
          }
        })
        .catch(err => {
          console.log("error", err) // log
          if (false) {
            customToast("error", err?.response?.data?.message);
          } else if (!navigator?.online) {
            customToast("error", "No connection to the internet");
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
        {!isForgotPassword ? (
          <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.heading}>Login</h1>
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
          </div>
          <p className={styles.error}>{errors.email?.message}</p>

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
                    "Password must include a number, an uppercase letter, and a symbol",
                },
              })}
            />
            <LockIcon />
          </div>
          <p className={styles.error}>{errors.password?.message}</p>

          <button className={styles.loginBtn}>
            {isLoading ? <Spinner borderWidth="3px" size="sm" /> : "Login"}
          </button>

          <div className={styles.googleBtnContainer}>
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
          </div>

          <div className={styles.links}>
            <Link to="/register">Create an account</Link>
            <button onClick={() => setIsForgotPassword(true)}>Forgot password?</button>
          </div>
        </form>
        ) : (
          <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
        )}
      </Center>
    </div>
  );
}
