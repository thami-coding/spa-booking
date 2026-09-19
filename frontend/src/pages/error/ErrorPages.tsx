import React from "react";
import styles from "./ErrorPage.module.css";

export interface ErrorDetails {
  statusCode?: number;
  statusText?: string;
  statusLabel?: string;
  message?:string;
}

interface ErrorPageProps {
  error?: ErrorDetails;
  onGoBack?: () => void;
  onReturnHome?: () => void;
}

const defaultStatus: ErrorDetails = {
  statusCode: 403,
  statusText: "Access Denied",
  statusLabel: "Forbidden Resource",
  message: "You do not have the necessary administrative privileges to view this page.",
};
//
export const ErrorPage: React.FC<ErrorPageProps> = ({
  error = defaultStatus,
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
          <h1 className={styles.statusCode}>{error.statusCode}</h1>
          <h2 className={styles.statusText}>{error.statusText}</h2>
          <p className={styles.statusLabel}>{error.statusLabel}</p>
        </div>
        <p className={styles.message}>{error.message}</p>
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
