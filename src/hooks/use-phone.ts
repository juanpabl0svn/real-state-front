import { useEffect } from "react";

type UsePhoneOptions = {
  maxLength?: number;
  selector?: string; // Para más flexibilidad
};

const allowedKeys = [
  "Backspace", "Enter", "Tab", "ArrowLeft", "ArrowRight", "Delete",
];

const isDigit = (key: string) => /^[0-9]$/.test(key);

const handleKeyDown = (e: KeyboardEvent, maxLength?: number) => {
  const input = e.target as HTMLInputElement;
  const key = e.key;

  if (maxLength && input.value.length >= maxLength && !allowedKeys.includes(key)) {
    e.preventDefault();
    return;
  }

  if (!isDigit(key) && !allowedKeys.includes(key)) {
    e.preventDefault();
    return;
  }

  if (input.value === "0" && isDigit(key)) {
    input.value = key;
    e.preventDefault();
  }
};

const handlePaste = (e: ClipboardEvent, maxLength?: number) => {
  const pasted = e.clipboardData?.getData("text") ?? "";
  const input = e.target as HTMLInputElement;

  if (!/^\d+$/.test(pasted)) {
    e.preventDefault();
    return;
  }

  const nextLength = input.value.length + pasted.length;
  if (maxLength && nextLength > maxLength) {
    e.preventDefault();
  }
};

export default function usePhone(options: UsePhoneOptions = {}) {
  const { maxLength, selector = '[aria-label="phone"]' } = options;

  useEffect(() => {
    const inputs = document.querySelectorAll(selector) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      const keyHandler = (e: KeyboardEvent) => handleKeyDown(e, maxLength);
      const pasteHandler = (e: ClipboardEvent) => handlePaste(e, maxLength);

      input.addEventListener("keydown", keyHandler);
      input.addEventListener("paste", pasteHandler);

      // Guardar para cleanup
      (input as any)._keyHandler = keyHandler;
      (input as any)._pasteHandler = pasteHandler;

      // Auto-asignar maxLength como atributo
      if (maxLength) input.maxLength = maxLength;
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("keydown", (input as any)._keyHandler);
        input.removeEventListener("paste", (input as any)._pasteHandler);
      });
    };
  }, [maxLength, selector]);
}
