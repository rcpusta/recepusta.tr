import { dchostLogin, dchostLogout, dchostRefresh, dchostRequest } from "./client";
import type { DchostClientDetails, DchostSignupInput, DchostTokens } from "./types";

export async function loginCustomer(email: string, password: string): Promise<DchostTokens> {
  return dchostLogin(email.trim(), password);
}

export async function signupCustomer(input: DchostSignupInput): Promise<DchostTokens | { ok: true }> {
  const body = {
    email: input.email.trim(),
    password: input.password,
    firstname: input.firstname.trim(),
    lastname: input.lastname.trim(),
    phonenumber: input.phonenumber?.trim() || "",
    country: input.country?.trim() || "TR",
    companyname: input.companyname?.trim() || "",
    address1: input.address1?.trim() || "",
    city: input.city?.trim() || "",
    state: input.state?.trim() || "",
    postcode: input.postcode?.trim() || "",
  };

  await dchostRequest("signup", { method: "POST", body });

  // After signup, obtain JWT
  try {
    return await dchostLogin(body.email, body.password);
  } catch {
    return { ok: true };
  }
}

export async function refreshCustomer(refreshToken: string) {
  return dchostRefresh(refreshToken);
}

export async function logoutCustomer(token: string) {
  return dchostLogout(token);
}

export async function getCustomerDetails(token: string): Promise<DchostClientDetails | null> {
  const data = await dchostRequest<{ client?: DchostClientDetails }>("details", { token });
  return data.client || null;
}
