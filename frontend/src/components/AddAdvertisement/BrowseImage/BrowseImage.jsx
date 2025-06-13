import { useRef, useState } from 'react';
import { FiCamera } from 'react-icons/fi';
import { GoAlert } from 'react-icons/go';
import { toast } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';

import { useImageUploader } from '../../../hooks/useImageUploader';

import css from './BrowseImage.module.css';

export default function BrowseImage() {
  const [selectedFiles, setSelectedFiles] = useState(() => {
    const saved = sessionStorage.getItem('ad_selectedFiles');
    return saved ? JSON.parse(saved) : [];
  });
  const [loadingStates, setLoadingStates] = useState(Array(10).fill(false));

  const { uploadFile } = useImageUploader();
  const maxFiles = 10;
  const fileInputsRef = useRef([]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (files, slotIndex) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== fileArray.length) {
      toast.custom(() => (
        <div
          style={{
            backgroundColor: 'var(--error-red)',
            color: 'var(--default-white)',
            width: '450px',
            height: '70px',
            padding: '15px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 'var(--font-size-tiny)',
            fontWeight: 'var(--font-weight-bold)',
            borderLeft:
              'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
            boxShadow: 'var(--cart-shadow)',
          }}
        >
          <GoAlert
            style={{
              width: 'var(--icon-size-large)',
              height: 'var(--icon-size-large)',
              fontSize: '32px',
              color: 'var(--default-white)',
            }}
          />
          Файл перевищує 5 МБ!
        </div>
      ));
    }

    const selectedFile = validFiles[0];
    if (!selectedFile) return;

    const updatedFiles = [...selectedFiles];
    const base64Image = await fileToBase64(selectedFile);

    updatedFiles[slotIndex] = base64Image;

    const updatedLoading = [...loadingStates];
    updatedLoading[slotIndex] = true;
    setLoadingStates(updatedLoading);

    setSelectedFiles(updatedFiles);
    sessionStorage.setItem('ad_selectedFiles', JSON.stringify(updatedFiles));

    try {
      await uploadFile(selectedFile, slotIndex);
    } finally {
      updatedLoading[slotIndex] = false;
      setLoadingStates([...updatedLoading]);
    }
  };

  const handleClick = (index) => {
    fileInputsRef.current[index]?.click();
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Завантажте фото</h3>
      <p className={css.advertSpan}>
        ({selectedFiles.filter(Boolean).length} з {maxFiles} завантажено)
      </p>
      <ul className={css.fotoList}>
        {Array.from({ length: maxFiles }).map((_, index) => {
          const base64 = selectedFiles[index];
          const isFilled = Boolean(base64);
          const isLoading = loadingStates[index];

          return (
            <li
              className={css.fotoItem}
              key={index}
              onClick={() => handleClick(index)}
            >
              {isLoading ? (
                <Oval
                  visible={true}
                  height="79"
                  width="79"
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                  color="var(--primary-yellow)"
                  secondaryColor="var(--primary-yellow-light)"
                  ariaLabel="oval-loading"
                />
              ) : isFilled ? (
                <img
                  src={base64}
                  alt={`Зображення ${index + 1}`}
                  className={css.previewImage}
                />
              ) : (
                <>
                  <FiCamera className={css.iconCamera} />
                  <p className={css.text}>Завантажте</p>
                  <p className={css.textFoto}>
                    Фото товару в<br /> повному розмірі
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => (fileInputsRef.current[index] = el)}
                style={{ display: 'none' }}
                onChange={({ target }) => handleFileSelect(target.files, index)}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
