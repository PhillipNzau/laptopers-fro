export interface CreateHubModel {
  title?: string;
  description?: string;
  location?: string;
  target_amount?: number;
  images?: string[];
  availability?: boolean;
}

export interface UpdateHubModel {
  title?: string;
  // phone?: string;
}

export interface HubResponseModel {
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

export interface HubUpdateResponseModel {
  message?: string;
  event?: HubResponseModel;
}
