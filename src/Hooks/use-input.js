import { useState } from "react";

const useInput = (validation) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const isInputValueValid = validation(inputValue);

  const inputFieldHasError = !isInputValueValid && isTouched;

  const inputChangeHandler = (event) => {

    if(event === undefined){
      return;
    }

    if(event.target === undefined){
      setInputValue(event);
      console.log(event);
    }else{
      setInputValue(event.target.value);
    }
  
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () =>{

    setInputValue('');
    setIsTouched(false);
  };

  return {
    inputValue,
    isInputValueValid,
    inputFieldHasError,
    inputChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
