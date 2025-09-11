export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  code: string;
  label: string;
  note?: string;
  latitude: number;
  longitude: number;
  generalAddress: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}