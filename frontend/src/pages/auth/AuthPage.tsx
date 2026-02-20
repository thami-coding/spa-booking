import useSWRMutation from "swr/mutation";
import styles from "./Auth.module.css";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../../api/auth";
import Spinner from "../../components/spinner/Spinner";
import type { AuthData } from "../../types/types";

type AuthProps = {
  mode: "login" | "signup";
};
const AuthPage = ({ mode }: AuthProps) => {
  const { trigger, isMutating } = useSWRMutation("/auth/login", login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthData>();

  const isLogin = mode === "login";
  const onSubmit: SubmitHandler<AuthData> = async (data) => {

    if (isLogin) {
      const { name, confirmPassword, ...rest } = data;
      const result = await trigger(rest);
      console.log(result);
    } else {
      trigger(data);
    }
    navigate("/");
  };

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
        {!isLogin && (
          <div className={styles.inputGroup}>
            <input type="password" {...register("confirmPassword")} required />
            <label>Confirm password</label>
          </div>
        )}

        <button
          disabled={isMutating}
          type="submit"
          className={`${styles.button} ${isMutating && styles.disabled}`}
        >
          {isMutating ? (
            <>
              <Spinner size={15} /> {" "} Loading
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
