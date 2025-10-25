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

export interface ReviewHubModel {
  rating?: string;
  description?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HubApiResponseModel {
  hub: HubResponseModel;
  reviews: [];
}

export interface HubResponseModel {
  id?: string;
  user_id?: string;
  title?: string;
  description?: string;
  coordinates?: Coordinates;
  location_name?: string;
  rating: string;
  images?: string[];
  created_at?: string; // ISO date string
  updated_at?: string;
}

export interface HubUpdateResponseModel {
  message?: string;
  event?: HubResponseModel;
}
