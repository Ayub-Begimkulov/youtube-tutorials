export {};

interface ErrorResponse<
  Details extends Record<string, unknown> = Record<string, unknown>
> {
  status: number;
  statusText: string;
  message: string;
  details?: Details;
}

interface FieldError {
  name: string;
  type: string;
  error: string;
}

type FormValidationError = ErrorResponse<{ fields: FieldError[] }>;

function isFormValidationError(value: unknown) {}

function submitForm() {
  try {
    // ...
    // do some logic and make a request
  } catch (error) {
    if (isFormValidationError(error)) {
      // show errors in the form
    }
    console.error(error);
  }
}

submitForm();
