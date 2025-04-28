import { useEffect } from "react";

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const cursorPosition = input.selectionStart || 0;
  const sanitizedValue = input.value.replace(/\D/g, "").substring(0, 10);
  input.value = sanitizedValue;
  input.setSelectionRange(cursorPosition, cursorPosition);
};

export default function usePhone() {
  return useEffect(() => {
    const phones = document.querySelectorAll('input[type="tel"][aria-label="phone"]') as NodeListOf<HTMLInputElement>;
    phones.forEach((phone) => {
      phone.addEventListener("input", handleInput);
    });

    return () => {
      phones.forEach((phone) => {
        phone.removeEventListener("input", handleInput);
      });
    };
  }, [])
}