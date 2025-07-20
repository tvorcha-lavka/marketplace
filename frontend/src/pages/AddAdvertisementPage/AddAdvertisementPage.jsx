import AddAdvert from '../../components/AddAdvertisement/AddAdvert/AddAdvert';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import css from './AddAdvertisementPage.module.css';

export default function AddAdvertisementPage() {
  return (
    <section className="container">
      <div className={`${css.wrap} section`}>
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            {
              label: 'Додати оголошення',
              to: '/advertisement',
              isActive: true,
            },
          ]}
        />
        <AddAdvert />
      </div>
    </section>
  );
}
