import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlusSquare } from '@fortawesome/free-solid-svg-icons';


export default function SquarePlus() {
  return (
    <FontAwesomeIcon
      icon={faPlusSquare}
      className="text-primary hover:text-green ransition-transform cursor-pointer text-4xl duration-300 hover:rotate-90"
    />
  );
}
