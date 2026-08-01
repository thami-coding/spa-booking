import React from "react";
import styles from "./ErrorPage.module.css";

interface ErrorPageProps {
  message?: string;
  statusCode?: number;
  statusText?: string;
  statusLabel?: string;
  onGoBack?: () => void;
  onReturnHome?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  message = "You do not have the necessary administrative privileges to view this page.",
  statusCode = 403,
  statusText = "Access Denied",
  statusLabel = "Forbidden Resource",
  onGoBack,
  onReturnHome = () => (window.location.href = "/"),
}) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      onReturnHome();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleGroup}>
          <h1 className={styles.statusCode}>{statusCode}</h1>
          <h2 className={styles.statusText}>{statusText}</h2>
          <p className={styles.statusLabel}>{statusLabel}</p>
        </div>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            onClick={handleGoBack}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Go Back
          </button>

          <button
            onClick={onReturnHome}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
