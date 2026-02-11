import BaseFormProps from '@/lib/types/BaseFormProps';

export default interface FileFormProps<T> extends BaseFormProps {
  onSubmit?: (formData: FormData) => void;
  handleFileChange?: (key: T, file: File) => void;
  hasFile?: (key: T) => boolean;
}
