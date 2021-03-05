import { useState, useEffect, useRef } from "react";

/**
 * This class function is a custom hook, used in the calculator part.
 * It handles the form that the user enters the calculation result in.
 * The class is a little complicated, as it was build based on a more complicated process.
 * However, it simply handles
 */
const useCustomForm = ({ initialValues, onSubmit }) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [onBlur, setOnBlur] = useState(false);

  const formRendered = useRef(true);

  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setOnSubmitting(false);
      setOnBlur(false);
    }
    formRendered.current = false;
  }, [initialValues]);

  const handleChange = (event) => {
    const re = /^[0-9\b]+$/;
    const { target } = event;
    const { name, value } = target;
    event.persist();

    if (target.value === "" || re.test(target.value)) {
      setValues({ ...values, [name]: value });
    }
  };

  const handleBlur = (event) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors });
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors({ ...errors });
    setValues(initialValues);
    onSubmit({ values, errors });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

export default useCustomForm;
