import { EmailIcon, LockIcon } from "../../assets/icons/loginRegisterIcons";
import { Center, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { customToast } from "../../utils/toastify";
import { userActions } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { organizationService } from "../../services/organization.service";
import ForgotPassword from "../../components/ForgotPassword";
import styles from "./Login.module.scss";

const roles = [
  { value: "", label: "Select role" },
  { value: "STUDENT", label: "Student" },
  { value: "ACADEMIC_AFFAIRS", label: "Academic Affairs" },
  { value: "PROFESSOR", label: "Professor" },
  { value: "MANAGER", label: "Manager" },
];

// email: "admin@gmail.com",
// password: "passworD1234$",
// role: "ADMIN",
// organization: "d38c9d1a-8d40-4f10-808b-c74fe64e18d9",

const notifyError = (err) => {
  if (err?.response?.data?.message == "Validation failed for fields: organizationId: Organization id is mandatory") {
    customToast("error", "Please, select organization");
  } else if(err?.response?.data?.message == "Validation failed for fields: role: Role is mandatory"){
    customToast("error", "Please, select role")
  } else if(err?.response?.data?.message == "Validation failed for fields: organizationId: Organization id is mandatory, role: Role is mandatory" || err?.response?.data?.message == "Validation failed for fields: role: Role is mandatory, organizationId: Organization id is mandatory"){
    customToast("error", "Please, select organization and role")
  } else if(err?.response?.data?.message){
    customToast("error", err?.response?.data?.message)
  }else {
    customToast("error", "Something went wrong");
  }
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [organization, setOrganization] = useState(undefined);
  const [role, setRole] = useState(undefined);
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
      role: role || undefined,
      organizationId: organization || undefined,
    };
    setIsLoading(true);
    authService.login(body)
      .then((res) => {
        if (res?.data?.token) {
          customToast("success", "Successfully logged in!");
          dispatch(userActions.setAuthorization({
            token: res?.data?.token,
            role: role
          }));
        }
      })
      .catch((err) => {
        notifyError(err)
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSuccess = (response) => {
    console.log("Google sign-in successful:", response);
    if (response?.credential) {
      setIsLoading(true);
      const body = {
        idToken: response?.credential,
        role: role,
        organizationId: organization,
      };

      authService.google(body)
        .then((res) => {
          if (res?.data?.token) {
            customToast("success", "Successfully logged in!");
            dispatch(userActions.setAuthorization({
              token: res?.data?.token,
              role: role
            }));
          }
        })
        .catch((err) => {
          notifyError(err)
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleGoogleFailure = (error) => {
    console.log("Google sign-in failed:", error);
  };

  useEffect(() => {
    organizationService
      .getAllAvailableOrganizations()
      .then((res) => {
        if (res?.status == 200) {
          setOrganizations(res?.data);
        }
      })
      .catch((err) => {
        console.log("Login>>UseEffect err:\n", err); // log
      })
  }, []);

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
              <select
                onChange={(e) => setOrganization(e?.target?.value)}
              >
                <option value="">Select organization</option>
                {organizations?.map((org) => (
                  <option key={org?.id} value={org?.id}>
                    {org?.name}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.error}>{errors.organization?.message}</p>

            <div className={styles.inputBox}>
              <select
                // defaultValue={roles[0]}
                onChange={(e) => setRole(e?.target?.value)}
              >
                {roles.map((role) => (
                  <option key={role?.value} value={role?.value}>
                    {role?.label}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.error}>{errors.organization?.message}</p>

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
              <button onClick={() => setIsForgotPassword(true)}>
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
        )}
      </Center>
    </div>
  );
}
