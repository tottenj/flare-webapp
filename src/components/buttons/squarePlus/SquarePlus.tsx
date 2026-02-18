import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export default function SquarePlus() {
  return (
    <FontAwesomeIcon
      icon={faPlusSquare}
      data-cy="square-plus-button"
      className="text-primary hover:animate-spinOnce hover:text-success cursor-pointer text-4xl"
    />
  );
}
