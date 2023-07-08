import styles from "./FeatureCard.module.css";
import Card from 'react-bootstrap/Card';
const FeatureCard = (props) => {

  return (
    <Card className={styles.FeatureCard} key={props.id} data-aos="fade-up"
      data-aos-anchor-placement="top-bottom" data-aos-duration="1000">
      <img src={props.icon} alt="icon" className={styles['card-icon']} />

      <div className={styles['card-content']}>
        <h3 className={styles.cardHeading}>{props.heading}</h3>
        <p>{props.description}</p>
      </div>
    </Card>
  );

};

export default FeatureCard;