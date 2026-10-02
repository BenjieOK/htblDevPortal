import { useId, useState } from 'react';
import Icon from './Icon.jsx';

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(source);
        reject(new Error('This image could not be processed.'));
        return;
      }
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(source);
        if (!blob) {
          reject(new Error('This image could not be processed.'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, src: reader.result });
        reader.onerror = () => reject(new Error('This image could not be read.'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.72);
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error('This image could not be opened.'));
    };
    image.src = source;
  });
}

export default function ImageAttachment({ attachment, onChange }) {
  const inputId = useId();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const selectImage = async (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Choose an image smaller than 8 MB.');
      return;
    }

    setError('');
    setProcessing(true);
    try {
      onChange(await compressImage(file));
    } catch (imageError) {
      setError(imageError.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="attachment-field">
      {attachment ? (
        <div className="attachment-preview">
          <img src={attachment.src} alt={`Attached image: ${attachment.name}`} />
          <div>
            <span title={attachment.name}>{attachment.name}</span>
            <button className="link-btn" type="button" onClick={() => onChange(null)}>Remove image</button>
          </div>
        </div>
      ) : (
        <label className="attachment-add" htmlFor={inputId}>
          <Icon name="file" size={16} /> {processing ? 'Preparing image…' : 'Attach image'}
          <input id={inputId} type="file" accept="image/*" onChange={selectImage} disabled={processing} />
        </label>
      )}
      <span className="attachment-hint">Images are resized before saving. Maximum original size: 8 MB.</span>
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}