import { FormEvent, ReactNode, useState, forwardRef, useRef } from "react";

import Button from "./Button";

interface StretchFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

const StretchForm = forwardRef<HTMLFormElement, StretchFormProps>(function StretchForm({ children, onSubmit, onCancel }, ref) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm && (
        <form ref={formRef} className="flex flex-col gap-4 pb-4" onSubmit={onSubmit}>
          {children}
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </form>
      )}
      <Button
        variant={showForm ? "secondary" : "primary"}
        onClick={() => {
          if (showForm) {
            formRef.current?.reset();
            if (onCancel) onCancel();
          }
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Cancelar" : "Adicionar"}
      </Button>
    </>
  );
});

export default StretchForm;
