interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  accept?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, type = 'text', value, onChange, required = false, placeholder = '', textarea = false, accept }) => {
    return (
      <div>
        <label htmlFor={id} className="block pb-2 text-sm font-medium text-sky-950">
          {label}
        </label>
        {textarea ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="block w-full border px-4 py-2 rounded-md"
          />
        ) : (
          <input
            type={type}
            id={id}
            name={id}
            value={type === 'file' ? undefined : value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="block w-full border px-4 py-2 rounded-md"
            accept={type === 'file' ? accept : undefined}
          />
        )}
      </div>
    );
  };
  

export default FormInput;