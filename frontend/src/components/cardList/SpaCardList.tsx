import SpaCard from './SpaCard';
import styles from './SpaCardList.module.css';



const SpaCardList = () => {
  const spaServices = [
    {
      title: 'Relaxing Swedish Massage',
      description: 'A full-body massage designed to ease tension and promote relaxation.',
      duration: '60 min',
      price: 120
    },
    {
      title: 'Deep Tissue Therapy',
      description: 'Targets deeper muscle layers for chronic tension relief.',
      duration: '75 min',
      price: 150
    },
    {
      title: 'Luxury Facial Treatment',
      description: 'Revitalizing facial treatment for glowing, healthy skin.',
      duration: '45 min',
      price: 95
    }
  ];
  return (
    <div className={styles.list}>
      {services.map((service, index) => (
        <SpaCard key={index} {...service} />
      ))}
    </div>
  );
};

export default SpaCardList;