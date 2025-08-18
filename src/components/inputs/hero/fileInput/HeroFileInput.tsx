import useFileChange from '@/lib/hooks/useFileChange/useFileChange';
import HeroInput, { HeroInputProps } from '../input/HeroInput';
import { InputProps } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export default function HeroFileInput(props: HeroInputProps) {
  const { validFiles, handleFileChange } = useFileChange();

  return (
    <HeroInput
      radius={props.radius || 'sm'}
      color={validFiles.length > 0 ? 'success' : 'default'}
      classNames={{ input: 'text-primary' }}
      type="file"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileChange('eventImage', file);
      }}
      endContent={<FontAwesomeIcon icon={faFile} />}
      {...props}
    />
  );
}
