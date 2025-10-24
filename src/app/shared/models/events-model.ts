export interface CreateEventModel {
  title?: string;
  description?: string;
  location?: string;
  target_amount?: number;
  images?: string[];
  availability?: boolean;
}

export interface UpdateEventModel {
  title?: string;
  // phone?: string;
}

export interface EventResponseModel {
  id?: string;
  user_id?: string;
  title?: string;
  description?: string;
  location?: string;
  target_amount?: number;
  images?: string[];
  available?: boolean;
  housekeepers?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface EventUpdateResponseModel {
  message?: string;
  event?: EventResponseModel;
}
