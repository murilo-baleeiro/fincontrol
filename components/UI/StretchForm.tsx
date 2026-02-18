import { FormEvent, ReactNode, useState, forwardRef, useRef } from "react";

import Button from "./Button";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";

interface StretchFormProps {
  buttons?: "default" | "transactions";
  buttonsActions?: Record<string, Function>;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

const StretchForm = forwardRef<HTMLFormElement, StretchFormProps>(function StretchForm({ children, onSubmit, onCancel, buttons = "default", buttonsActions }, ref) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const customEvent = {
      ...e,
      currentTarget: form,
      target: form,
      preventDefault: () => {},
    } as FormEvent<HTMLFormElement>;

    onSubmit(customEvent);
    setShowForm(false);
  };

  return (
    <>
      {showForm && (
        <form ref={formRef} className="pb-4" onSubmit={handleSubmit}>
          <section className="flex flex-col gap-4 pb-6">{children}</section>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </form>
      )}
      {buttons === "default" && (
        <Button
          variant={showForm ? "secondary" : "primary"}
          onClick={() => {
            if (showForm) {
              formRef.current?.reset();
              onCancel && onCancel();
            }
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "Adicionar"}
        </Button>
      )}

      {!showForm && buttons === "transactions" && (
        <>
          <div className="flex flex-row gap-4 items-center">
            <Button
              className="flex flex-row gap-2 justify-center items-center font-normal bg-red-400 active:bg-red-400 hover:bg-red-400 ring-red-400 focus:ring-2 focus:ring-offset-2 border border-red-400 focus:ring-red-400"
              onClick={() => {
                setShowForm(true);
                buttonsActions && buttonsActions.outbound && buttonsActions.outbound();
              }}
            >
              <CircleArrowUp strokeWidth={1.5} className="text-white" />
              <span>Despesa</span>
            </Button>
            <Button
              className="flex flex-row gap-2 justify-center items-center font-normal bg-emerald-400 active:bg-emerald-400 hover:bg-emerald-400 ring-emerald-400 focus:ring-2 focus:ring-offset-2 border border-emerald-400 focus:ring-emerald-400"
              onClick={() => {
                setShowForm(true);
                buttonsActions && buttonsActions.inbound && buttonsActions.inbound();
              }}
            >
              <CircleArrowDown strokeWidth={1.5} className="text-white" />
              <span>Receita</span>
            </Button>
          </div>
        </>
      )}
    </>
  );
});

export default StretchForm;
