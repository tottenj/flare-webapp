import { Card } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroCardProps = ComponentProps<typeof Card>;

function HeroCardRoot(props: HeroCardProps) {



  return <Card {...props} className={`rounded-md ${props.className ?? ''}`} />;
}

const HeroCard = Object.assign(HeroCardRoot, {
  Header: Card.Header,
  Title: Card.Title,
  Description: Card.Description,
  Content: Card.Content,
  Footer: Card.Footer,
});

export default HeroCard;
