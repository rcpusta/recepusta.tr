export type DchostTokens = {
  token: string;
  refresh: string;
};

export type DchostCategory = {
  id: string;
  name: string;
  description?: string;
  slug?: string;
};

export type DchostPeriod = {
  title: string;
  value: string;
  price: number;
  setup?: number;
  selected?: boolean;
};

export type DchostProduct = {
  id: string;
  type?: string;
  name: string;
  stock?: boolean;
  paytype?: string;
  description?: string;
  qty?: string;
  tags?: string[];
  periods?: DchostPeriod[];
};

export type DchostSignupInput = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phonenumber?: string;
  country?: string;
  companyname?: string;
  address1?: string;
  city?: string;
  state?: string;
  postcode?: string;
};

export type DchostOrderInput = {
  productId: string;
  domain?: string;
  cycle?: string;
  pay_method?: number | string;
  custom?: Record<string, unknown>;
  promocode?: string;
};

export type DchostOrderResult = {
  order_num?: number | string;
  invoice_id?: string | number;
  total?: string | number;
  items?: unknown;
  error?: string;
  message?: string;
};

export type DchostClientDetails = {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  companyname?: string;
  phonenumber?: string;
  country?: string;
  lastlogin?: string;
};

export type DchostService = {
  id: string;
  name?: string;
  domain?: string;
  status?: string;
  label?: string;
  billingcycle?: string;
  nextduedate?: string;
  product?: string;
  [key: string]: unknown;
};

export type DchostInvoice = {
  id: string;
  status?: string;
  total?: string | number;
  date?: string;
  duedate?: string;
  [key: string]: unknown;
};

export type DchostTicket = {
  id?: string;
  number?: string;
  subject?: string;
  status?: string;
  department?: string;
  date?: string;
  [key: string]: unknown;
};

export type DchostDomain = {
  id: string;
  name?: string;
  status?: string;
  registrar?: string;
  expiry?: string;
  [key: string]: unknown;
};

export type DchostCertificate = {
  id: string;
  name?: string;
  status?: string;
  domain?: string;
  [key: string]: unknown;
};

export type DchostDnsZone = {
  id: string;
  name?: string;
  [key: string]: unknown;
};
