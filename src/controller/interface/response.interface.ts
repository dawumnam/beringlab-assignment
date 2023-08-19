export interface CreateResponse {
  token: string;
  id: string;
}

export interface VerifyResponse extends CreateResponse {}

export interface RegisterResponse {
  ids: string[];
}
