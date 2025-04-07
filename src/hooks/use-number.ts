import { useEffect } from "react";

const handleSubmitNumber = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement;
  const key = e.key;
  if (target.value.startsWith("0")) {
    target.value = target.value.substring(1);
  }

  if (Number.isNaN(Number(key)) && key !== "Backspace" && key !== "Enter") {
    e.preventDefault();
  }

}

export default function useNumber() {
  return useEffect(() => {
    const inputs = document.querySelectorAll("input[type=number]") as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      (input as HTMLInputElement).addEventListener("keydown", handleSubmitNumber);
    })

    return () => {
      inputs.forEach((input) => {
        (input as HTMLInputElement).removeEventListener("keydown", handleSubmitNumber);
      })
    }
  }, [])
}