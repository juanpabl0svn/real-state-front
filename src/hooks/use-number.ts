import { useEffect } from "react";

type UseNumberOptions = {
  maxLength?: number;
};

const allowedKeys = [
  "Backspace",
  "Enter",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
];

const isDigit = (key: string) => /^[0-9]$/.test(key);

const handleKeyDown = (e: KeyboardEvent, maxLength?: number) => {
  const target = e.target as HTMLInputElement;
  const key = e.key;

  // Limitar longitud
  if (maxLength && target.value.length >= maxLength && !allowedKeys.includes(key)) {
    e.preventDefault();
    return;
  }

  // Solo permitir dígitos o teclas control
  if (!isDigit(key) && !allowedKeys.includes(key)) {
    e.preventDefault();
    return;
  }

  // Eliminar ceros iniciales
  if (target.value === "0" && isDigit(key)) {
    target.value = key;
    e.preventDefault();
  }
};

const handlePaste = (e: ClipboardEvent, maxLength?: number) => {
  const pasted = e.clipboardData?.getData("text") ?? "";
  if (!/^\d+$/.test(pasted)) {
    e.preventDefault();
    return;
  }

  const target = e.target as HTMLInputElement;
  const nextLength = target.value.length + pasted.length;
  if (maxLength && nextLength > maxLength) {
    e.preventDefault();
  }
};

export default function useNumber(options: UseNumberOptions = {}) {
  const { maxLength } = options;

  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="number"]') as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      const keyHandler = (e: KeyboardEvent) => handleKeyDown(e, maxLength);
      const pasteHandler = (e: ClipboardEvent) => handlePaste(e, maxLength);

      input.addEventListener("keydown", keyHandler);
      input.addEventListener("paste", pasteHandler);

      // Guardar referencia para cleanup
      (input as any)._keyHandler = keyHandler;
      (input as any)._pasteHandler = pasteHandler;
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("keydown", (input as any)._keyHandler);
        input.removeEventListener("paste", (input as any)._pasteHandler);
      });
    };
  }, [maxLength]);
}
