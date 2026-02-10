import styles from './SpaCard.module.css';

export interface SpaCardProps {
  title: string;
  description: string;
  duration: string;
  price: number;
  onSelect?: () => void;
}

const SpaCard = ({ title, description, duration, price, onSelect }: SpaCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.duration}>{duration}</span>
        <span className={styles.price}>${price.toFixed(2)}</span>
      </div>

      {onSelect && (
        <button className={styles.button} onClick={onSelect}>
          Book Now
        </button>
      )}
    </div>
  );
};

export default SpaCard;