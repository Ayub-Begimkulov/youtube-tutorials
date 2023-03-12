export {};

interface ErrorResponse {
  status: number;
  statusText: string;
  message: string;
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (!isObject(value)) {
    return false;
  }

  if (
    "status" in value &&
    typeof value.status === "number" &&
    "statusText" in value &&
    typeof value.statusText === "string" &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return true;
  }

  return false;
}

function submitForm() {
  try {
    // ...
    // do some logic and make a request
  } catch (error) {
    if (isErrorResponse(error)) {
      error;
      // ^?
      // show alert with error
      // Alert.open({type: 'error', message: error.message})
    }
    console.error(error);
  }
}

submitForm();
