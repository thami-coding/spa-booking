import styles from "./Auth.module.css";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import Spinner from "../../components/spinner/Spinner";
import type { ApiErrorPayload, SignupData } from "../../types/types";
import type { AxiosError } from "axios";
import { mutate } from "swr";
import { useLogin, useSignup } from "../../hooks/authHooks";

type AuthProps = {
  mode: "login" | "signup";
};
const AuthPage = ({ mode }: AuthProps) => {
  const navigate = useNavigate();
  const {
    trigger: login,
    isMutating: isSignupLoading,
    error: signupError,
  } = useLogin();

  const {
    trigger: signup,
    isMutating: isLoginLoading,
    error: loginError,
  } = useSignup();

  const {
    register,
    handleSubmit,
    // formState: { errors }, //TOD: use these form errors for client side validation
  } = useForm<SignupData>();

  const isLogin = mode === "login";

  const err = (loginError || signupError) as AxiosError<ApiErrorPayload>;
  console.log(err?.response);

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    if (isLogin) {
      const { name, confirmPassword, ...loginCredentials } = data;
      const userResponse = await login(loginCredentials);

      await mutate("/users/me", userResponse, { revalidate: false });
      navigate("/book", { replace: true });
    } else {
      await signup(data);
      navigate("/login", { replace: true });
    }
  };

  const isLoading = isLoginLoading || isSignupLoading;
  const errDetails = err?.response?.data?.detail;
  const errorMsg =
    typeof errDetails === "string"
      ? errDetails
      : Array.isArray(errDetails) && errDetails[0].msg;

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please sign in to continue</p>

        {!isLogin && (
          <div className={styles.inputGroup}>
            <input {...register("name")} required />
            <label>Name</label>
          </div>
        )}
        <div className={styles.inputGroup}>
          <input type="email" {...register("email")} required />
          <label>Email</label>
        </div>

        <div className={styles.inputGroup}>
          <input type="password" {...register("password")} required />
          <label>Password</label>
        </div>
        {err && <div className={styles.error}>{errorMsg}</div>}

        {!isLogin && (
          <div className={styles.inputGroup}>
            <input type="password" {...register("confirmPassword")} required />
            <label>Confirm password</label>
          </div>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className={`${styles.button} ${isLoading && styles.disabled}`}
        >
          {isLoading ? (
            <>
              <Spinner size={15} /> Loading
            </>
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Signup"
          )}
        </button>

        <div className={styles.footer}>
          <span>Don't have an account?</span>{" "}
          <Link
            to={`/${isLogin ? "signup" : "login"}`}
            className={styles.loginLink}
          >
            {isLogin ? "Signup" : "Login"}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
