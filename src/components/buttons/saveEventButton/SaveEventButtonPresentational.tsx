'use client';

import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SaveEventButtonPresentational({
  filled,
  disabled,
  onClick,
}: {
  filled: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={filled ? 'Remove from saved events' : 'Save event'}
      aria-pressed={filled}
      className="w-fit bg-transparent"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <FontAwesomeIcon
        className={`hover:text-primary text-4xl transition-all ease-in-out ${filled ? 'text-primary' : 'text-primary-50'}`}
        icon={faBookmark}
      />
    </button>
  );
}
