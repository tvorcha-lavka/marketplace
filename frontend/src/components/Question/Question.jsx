import { useState } from 'react';

import QuestionSkeleton from './QuestionSkeleton';

import { media } from '../../utils/mediaConfig';
import { faqList } from '../../utils/faqList';
import QuestionItem from '../QuestionItem/QuestionItem';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './Question.module.css';

export default function Question() {
  const [openId, setOpenId] = useState(null);

  const delayedLoading = useDelayedLoading();
  if (delayedLoading) return <QuestionSkeleton />;

  return (
    <section className="container">
      <div className={css.section}>
        <h2 className={css.title}>
          Найчастіші питання до
          <span className={css.spanTitle}> Tvorcha Lavka</span>
        </h2>
        <div className={css.contentbox}>
          <img
            src={`${media}/page/question_img.jpg`}
            alt="Doing creative work"
          />

          <ul className={css.accordion}>
            {faqList?.map((faqItem, id) => (
              <QuestionItem
                key={id}
                faqItem={faqItem}
                onClick={() =>
                  id === openId ? setOpenId(null) : setOpenId(id)
                }
                isOpen={id === openId}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
