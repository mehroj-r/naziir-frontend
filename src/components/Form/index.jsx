import { Component, useState, useEffect } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../Input";

export default class CustomForm extends Component {
  static Input(props) {
    return <FormInput {...props} />;
  }

  static Item(props) {
    return <FormItem style={{ height: '64px' }} {...props} />;
  }

  static FieldArrayItem(props) {
    return <FieldArrayItem {...props} />;
  }

  render() {
    return <FromWrapper {...this.props} />;
  }
}

const FromWrapper = ({ initialValues, onSubmit, children, rules }) => {
  const [formRules, setFormRules] = useState(null);

  useEffect(() => {
    let obj = {};
    for (let key in rules) {
      obj[key] = rules[key](Yup);
    }

    setFormRules(obj);
  }, [rules]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object(formRules ?? {})}
      onSubmit={onSubmit}
    >
      {(formik) => children(formik)}
    </Formik>
  );
};

const FormInput = ({ type = "text", name = "", label = "", ...args }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Input name={name} type={type} {...args} />
      <ErrorMessage name={name} />
    </div>
  );
};

const FormItem = ({
  name = "",
  label = "",
  children,
  formik,
  required,
  ...props
}) => {
  return (
    <div style={{ width: "100%" }} {...props}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          <span className="text-[#ff4d4f]">{required && "*"}</span>
        </label>
      )}
      {children}
      {formik?.errors[name] && formik?.touched[name] && (
        <div
          className="min-h-6 w-full"
          style={{ fontSize: "12px", lineHeight: 1.5715, color: "#ff4d4f" }}
        >
          {formik?.errors?.[name]}
        </div>
      )}
      {/* <div // TODO: if in forms there is problem with style due to no error container, look here
        className="min-h-6 w-full"
        style={{ fontSize: "12px", lineHeight: 1.5715, color: "#ff4d4f" }}
      >
        {formik.errors[name] && formik.touched[name] ?
          formik.errors?.[name]
          : <></>}
      </div> */}
    </div>
  );
};

const FieldArrayItem = ({
  name = "",
  label = "",
  children,
  formik,
  index,
  custom = "false",
  custom_error,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      {children}
      <div className="w-full" style={{ fontSize: "14px", color: "#ff4d4f" }}>
        {custom
          ? custom_error
          : formik.errors[name] &&
            formik.errors[name][index] &&
            formik.touched[name] &&
            formik.touched[name][index]
          ? formik.errors[name][index]
          : ""}
      </div>
    </div>
  );
};
