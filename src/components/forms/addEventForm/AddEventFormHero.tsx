import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
export default function AddEventFormHero() {
  return (
    <Form>
      <Input
        variant="flat"
       
        radius="md"
        labelPlacement="outside-top"
        label="Blah"
        isRequired
      />
    </Form>
  );
}
