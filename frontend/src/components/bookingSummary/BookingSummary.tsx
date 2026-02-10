import styles from './BookingSummary.module.css';

interface BookingSummaryProps {
    fullName: string;
    email: string;
    phone: string;
    service: string;
    preferredDate: string;
    preferredTime: string;
    guests: number;
    specialRequests?: string;
    price: number;
    onPay: () => void;
}

const BookingSummary = ({
    fullName = "Thami",
    email = "test@tes",
    phone = "0877373883",
    service = "general",
    preferredDate = "09-12-2025",
    preferredTime = "9:00",
    guests = 2,
    specialRequests = "None",
    price = 800,
    onPay
}: BookingSummaryProps) => {
    return (
        <div className={styles.top}>
            <div className={styles.container}>
                <h2 className={styles.title}>Booking Summary</h2>

                <div className={styles.summaryItem}>
                    <span>Full Name</span>
                    <strong>{fullName}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Email Address</span>
                    <strong>{email}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Phone Number</span>
                    <strong>{phone}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Service</span>
                    <strong>{service}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Preferred Date</span>
                    <strong>{preferredDate}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Preferred Time</span>
                    <strong>{preferredTime}</strong>
                </div>

                <div className={styles.summaryItem}>
                    <span>Guests</span>
                    <strong>{guests}</strong>
                </div>

                {specialRequests && (
                    <div className={styles.notes}>
                        <span>Special Requests</span>
                        <p>{specialRequests}</p>
                    </div>
                )}

                <div className={styles.divider} />

                <div className={styles.priceRow}>
                    <span>Total Price</span>
                    <strong>${price.toFixed(2)}</strong>
                </div>

                <button className={styles.payButton} onClick={onPay}>
                    Proceed to Payment
                </button>
            </div>
        </div>

    );
};

export default BookingSummary;