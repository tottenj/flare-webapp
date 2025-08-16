import { Input, InputProps } from '@heroui/react';

interface HeroInputProps extends InputProps {}

export default function HeroInput(props: HeroInputProps) {
  return <Input
    variant={props.variant || 'flat'}
    radius={props.radius || 'md'} 
    labelPlacement={props.labelPlacement || "outside-top"}
    {...props} 
    />;
}
