import styles from "./Row.module.css";

type RowProps = {
    detail: string | number
    detailName: string
}

export default function Row({ detail, detailName }: RowProps) {
  return (
    <div className={styles.summaryItem}>
      <span>{detailName}</span>
      <strong>{detail}</strong>
    </div>
  );
}
