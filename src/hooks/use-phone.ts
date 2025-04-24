import { useEffect } from "react";


const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, "").substring(0, 10);
  input.value = value;
}


export default function usePhone() {

  return useEffect(() => {
    const phones = document.querySelectorAll('[aria-label="phone"]') as NodeListOf<HTMLInputElement>;
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