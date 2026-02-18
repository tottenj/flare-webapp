export default interface BaseFormProps {
  pending?: boolean;
  error?: string;
  validationErrors?: Record<string, string[]>;
}
