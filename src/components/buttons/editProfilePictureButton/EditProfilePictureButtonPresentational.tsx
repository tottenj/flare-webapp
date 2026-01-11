'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ChangeEventHandler } from 'react';

export default function EditProfilePictureButtonPresentational({
  onChange,
  isDisabled,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  isDisabled: boolean;
}) {
  return (
    <label
      htmlFor="profile-pic-upload"
      className="!absolute top-2 right-2 z-10 flex w-fit cursor-pointer items-center justify-center rounded-full border-1 border-gray-100 bg-white shadow-2xl transition duration-100 ease-in-out hover:scale-105 hover:bg-gray-100"
    >
      <FontAwesomeIcon className="text-primary p-2 text-lg" icon={faPenToSquare} />
      <input
        data-cy="profile-pic-input"
        disabled={isDisabled}
        onChange={onChange}
        id="profile-pic-upload"
        type="file"
        accept="image/*"
        className="hidden"
      />
    </label>
  );
}
