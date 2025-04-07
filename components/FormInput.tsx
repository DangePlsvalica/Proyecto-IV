interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, type = 'text', value, onChange, required = false, placeholder = '', textarea = false }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium">
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
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="block w-full border px-4 py-2 rounded-md"
          />
        )}
      </div>
    );
  };
  

export default FormInput;

