'use client';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../mainModal/MainModal';
import { useState } from 'react';
import FilterForm from '@/components/forms/filterForm/FilterForm';

export default function FilterModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="text-primary absolute top-0 right-0 cursor-pointer"
        aria-label="Filter options"
      >
        <FontAwesomeIcon
          className="duration-200 ease-in-out hover:scale-110"
          icon={faFilter}
          size="lg"
        />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <FilterForm close={() => setOpen(false)} />
      </Modal>
    </>
  );
}
