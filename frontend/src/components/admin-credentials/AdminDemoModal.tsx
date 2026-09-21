import { useEffect, useRef, useState } from "react";
import styles from "./AdminDemoModal.module.css";

const EMAIL = "test@test.com";
const PASSWORD = "Test@test1";

export default function AdminDemoModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="admin-demo-title"
      onClose={() => setIsOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(!isOpen);
      }}
    >
      <div className={styles.content}>
        <h2 id="admin-demo-title" className={styles.title}>
          Admin demo login
        </h2>
        <p className={styles.text}>To log in as admin, enter these details:</p>

        <dl className={styles.details}>
          <div>
            <dt className={styles.label}>Email</dt>
            <dd className={styles.value}>{EMAIL}</dd>
          </div>
          <div>
            <dt className={styles.label}>Password</dt>
            <dd className={styles.value}>{PASSWORD}</dd>
          </div>
        </dl>

        <button
          type="button"
          className={styles.close}
          onClick={() => setIsOpen(!isOpen)}
        >
          Got it
        </button>
      </div>
    </dialog>
  );
}
