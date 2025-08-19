<<<<<<< HEAD
import { useState } from 'react';

export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal
  };
=======
import { useState } from 'react';

export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal
  };
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
};