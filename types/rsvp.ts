export type Location = 'Lagos' | 'London' | 'Portugal';

export interface Guest {
  id: string;
  invite_code: string;
  name: string;
  email?: string;
  allowed_locations: Location[];
  code_generated_at?: string;
  unique_link?: string;
  allowed_plus_ones?: number;
}

export interface RSVP {
  id?: string;
  invite_code?: string;
  location: Location;
  name: string;
  guests: number;
  attending: boolean;
  dietary_restrictions?: string;
  visa_required?: boolean;
  accommodation_needed?: boolean;
  submitted_at?: string;
  plus_one_names?: string[];
}

export interface AirtableGuestRecord {
  id: string;
  fields: {
    invite_code?: string;
    name: string;
    email?: string;
    allowed_locations?: string[];
    code_generated_at?: string;
    allowed_plus_ones?: number;
  };
}

export interface AirtableRSVPRecord {
  id?: string;
  fields: {
    invite_code?: string;
    location: string;
    name: string;
    guests: number;
    attending: boolean;
    dietary_restrictions?: string;
    visa_required?: boolean;
    accommodation_needed?: boolean;
    submitted_at?: string;
    plus_one_names?: string | string[]; // Can be string (comma-separated) or array from API
  };
}


