import axios from "axios";

export const getLoginErrorMessageKey = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "auth.serverError";
  if (!error.response) return "auth.serverUnavailable";

  if (error.response.status === 401) return "auth.invalidCredentials";
  if (error.response.status === 429) return "auth.tooManyAttempts";
  if (error.response.status >= 500) return "auth.serverError";

  return "auth.loginFailed";
};

export const getRegisterErrorMessageKey = (error: unknown) => {
  if (!axios.isAxiosError(error)) return "auth.serverError";
  if (!error.response) return "auth.serverUnavailable";

  if (error.response.status === 400) return "auth.validationFailed";
  if (error.response.status === 409) return "auth.emailAlreadyInUse";
  if (error.response.status === 429) return "auth.tooManyAttempts";
  if (error.response.status >= 500) return "auth.serverError";

  return "auth.registrationFailed";
};
