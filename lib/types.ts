export interface Link {
  platform: string;
  url: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}

export interface DragEndEvent {
  active: {
    id: string;
  };
  over?: {
    id: string;
  };
}
