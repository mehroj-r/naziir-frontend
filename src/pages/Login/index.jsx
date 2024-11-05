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

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const onSubmit = (data) => {

    const body = {
      email: data?.email,
      password: data?.password,
    };

    console.log("data", data) // log

    setIsLoading(true)
    authService
      .login(body)
      .then((res) => {
        console.log("res", res); // log
        if (res?.data?.token) {
          customToast("success", "Successfully logged in!")
          console.log("res?.data?.token", res?.data?.token) // log
          dispatch(userActions.setToken(res?.data?.token))
        }
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          customToast("error", err?.response?.data?.message)
        } else if(!navigator?.online){
          customToast("error", "No connection to the internet")
        } else {
          customToast("error", "Something went wrong")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
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
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
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
            <EmailIcon />
          </div>
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
          <button className={styles.loginBtn}>
            {isLoading ? <Spinner borderWidth="3px" size="sm"/> : "Login"}
          </button>
          <div className={styles.links}>
            <Link to="/register">Create an account</Link>
            <Link to="#">Forgot password?</Link>
          </div>
        </form>
      </Center>
    </div>
  );
}
