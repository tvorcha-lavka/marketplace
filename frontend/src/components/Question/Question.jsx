import { useState } from 'react';
import styles from './Question.module.css';
import questionImg from '../../images/questionImg.jpg';
import { faqList } from '../../utils/faqList';
import QuestionItem from '../QuestionItem/QuestionItem';


export default function Question() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Найчастіші питання до
        <span className={styles.span_title}> Tvorcha Lavka</span>
      </h2>
      <div className={styles.contentbox}>
        <div className={styles.imgbox}>
          <img src={questionImg} alt="" className={styles.img} />
        </div>

        <ul className={styles.accordion}>
          {faqList?.map((faqItem, id) => (
            <QuestionItem
              key={id}
              faqItem={faqItem}
              onClick={() => (id === openId ? setOpenId(null) : setOpenId(id))}
              isOpen={id === openId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
