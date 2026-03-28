const API_BASE_URL = 'http://localhost:8000';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

export interface ContactInput {
  name: string;
  phone: string;
  relation: string;
}

export interface SOSPayload {
  user_name: string;
  latitude: number;
  longitude: number;
}

export interface SOSWhatsAppStatus {
  contacts_found: number;
  notifications_sent: number;
  notifications_failed: number;
  detail: string | null;
}

export interface WhatsAppStatusResponse {
  configured: boolean;
  contacts_found: number;
  valid_contacts: number;
  invalid_contacts: number;
  detail: string;
}

export interface LocationPayload {
  user_name: string;
  latitude: number;
  longitude: number;
}

export interface SOSResponse extends SOSPayload {
  id: number;
  timestamp: string;
  whatsapp: SOSWhatsAppStatus;
}

export interface LocationResponse extends LocationPayload {
  id: number;
  timestamp: string;
}

interface DeleteContactResponse {
  message: string;
  id: number;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        errorMessage = errorBody.detail;
      }
    } catch {
      // Keep fallback error message if response is not JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function getContacts(): Promise<Contact[]> {
  return request<Contact[]>('/contacts');
}

export async function addContact(contact: ContactInput): Promise<Contact> {
  return request<Contact>('/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  });
}

export async function deleteContact(id: number): Promise<DeleteContactResponse> {
  return request<DeleteContactResponse>(`/contacts/${id}`, {
    method: 'DELETE',
  });
}

export async function sendSOS(data: SOSPayload): Promise<SOSResponse> {
  return request<SOSResponse>('/sos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getWhatsAppStatus(): Promise<WhatsAppStatusResponse> {
  return request<WhatsAppStatusResponse>('/sos/whatsapp-status');
}

export async function sendLocation(data: LocationPayload): Promise<LocationResponse> {
  return request<LocationResponse>('/location', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
