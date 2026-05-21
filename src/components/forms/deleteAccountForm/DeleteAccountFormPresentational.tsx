'use client';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import FormError from '@/components/errors/Formerror/FormError';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import BaseFormProps from '@/lib/types/BaseFormProps';
import { Form } from '@heroui/form';

interface DeleteAccountFormProps extends BaseFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
}

export default function DeleteAccountFormPresentational({
  error,
  validationErrors,
  pending,
  onSubmit,
  onCancel,
}: DeleteAccountFormProps) {
  return (
    <Form className="flex flex-col gap-4" action={onSubmit} validationErrors={validationErrors}>
      <h2 className="mr-auto ml-auto text-center">Confirm Account Deletion</h2>
      <p className="text-center">
        Deleting your account is permanent and cannot be undone. All of your data, including your
        profile, events, and associated information, will be permanently removed from Flare. To
        confirm this action, please re-enter your email and password.
      </p>
      <FormError error={error} />
      <HeroInput
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email to confirm deletion"
        required
      />
      <HeroInput
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password to confirm deletion"
        required
      />
      <div className="mt-4 flex w-full gap-4">
        <HeroButton
          type="button"
          disabled={pending}
          color="default"
          className="w-full"
          onPress={onCancel}
          data-cy="cancel-delete-account-button"
        >
          Cancel
        </HeroButton>
        <HeroButton
          type="submit"
          data-cy="delete-account-button"
          disabled={pending}
          color="danger"
          className="w-full"
        >
          Delete Account
        </HeroButton>
      </div>
    </Form>
  );
}
