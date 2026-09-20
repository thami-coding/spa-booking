import styles from "./Auth.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import Spinner from "../../components/spinner/Spinner";
import type { ApiErrorPayload, SignupData } from "../../types/types";
import type { AxiosError } from "axios";
import { mutate } from "swr";
import { useLogin, useSignup } from "../../hooks/authHooks";
import { Eye, EyeOff } from "lucide-react";
import { formatErrors } from "../../lib/error-details";

type AuthProps = {
  mode: "login" | "signup";
};

const AuthPage = ({ mode }: AuthProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    // formState: { errors }, //TOD: use these form errors for client side validation
  } = useForm<SignupData>();

  const isLoginMode = mode === "login";
  const isLoading = login.isMutating || signup.isMutating;
  const err = (login?.error || signup?.error) as AxiosError<ApiErrorPayload>;
  const errDetails = err?.response?.data;
  const errors = formatErrors(errDetails);

  const spinner = isLoading && <Spinner size={15} />;
  const buttonText = isLoginMode ? "Sign In" : "Signup";
  const toggleLabel = isLoginMode ? "signup" : "login";
  let isServerError = false;

  const toggleShowPassword = showPassword ? (
    <Eye size={14} />
  ) : (
    <EyeOff size={14} />
  );

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    if (isLoginMode) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, confirmPassword, ...loginCredentials } = data;
      const userResponse = await login.trigger(loginCredentials);
      await mutate("/users/me", userResponse, { revalidate: false });
      navigate("/book", { replace: true });
    } else {
      await signup.trigger(data);
      navigate("/login", { replace: true });
    }
  };

  if (err) {
    const status = err?.response?.status;
    isServerError = status === undefined || status >= 500;
  }
  
  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        {isServerError && !isLoginMode && (
          <p className={isServerError ? styles.err : styles.subtitle}>
            Something went wrong. Please try again later
          </p>
        )}
        {isLoginMode && <p className={styles.title}>Welcome Back</p>}
        {isLoginMode && (
          <p className={isServerError ? styles.err : styles.subtitle}>
            {isServerError
              ? "Something went wrong. Please try again later"
              : "Please sign in to continue"}
          </p>
        )}
        {!isLoginMode && (
          <div className={styles.inputGroup}>
            <input {...register("name")} required />
            <label>Name</label>
          </div>
        )}
        {errors?.name && <div className={styles.error}>{errors.name}</div>}
        <div className={styles.inputGroup}>
          <input {...register("email")} required />
          <label>Email</label>
        </div>
        {errors?.email && <div className={styles.error}>{errors.email}</div>}
        <div className={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            required
          />
          <label>Password</label>
          <button
            className={styles.showPassword}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {toggleShowPassword}
          </button>
        </div>
        {errors?.password && (
          <div className={styles.error}>{errors.password}</div>
        )}

        {!isLoginMode && (
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              required
            />
            <label>Confirm password</label>
            <button
              className={styles.showPassword}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {toggleShowPassword}
            </button>
          </div>
        )}
        {errors?.confirmPassword && (
          <div className={styles.error}>{errors.confirmPassword}</div>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className={`${styles.button} ${isLoading && styles.disabled}`}
        >
          {spinner} {buttonText}
        </button>

        <div className={styles.footer}>
          <span>Don't have an account?</span>{" "}
          <Link to={`/${toggleLabel}`} className={styles.loginLink}>
            {toggleLabel}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
