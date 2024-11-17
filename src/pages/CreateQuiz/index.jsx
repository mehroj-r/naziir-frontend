import React, { useState } from "react";
import Step1 from "../../components/CreateQuizSteps/Step1/Step1";
import Step2 from "../../components/CreateQuizSteps/Step2/Step2";
import Step3 from "../../components/CreateQuizSteps/Step3/Step3";
import styles from "./CreateQuiz.module.scss";
import { useForm } from "react-hook-form";

export default function CreateQuiz(){
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const onSubmit = (data) => {
    console.log("quiz data", data) // log
  }

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} register={register}/>;
      case 2:
        return <Step2 nextStep={nextStep} register={register} prevStep={prevStep} />;
      case 3:
        return <Step3 prevStep={prevStep} register={register} />;
      default:
        return <Step1 nextStep={nextStep} register={register} />;
    }
  };

  return (
    <div className={styles.createQuiz}>
      <form onSubmit={handleSubmit(onSubmit)}>
        { renderStep() }
      <button type="submit">submit</button>
      </form>
    </div>
  );
};