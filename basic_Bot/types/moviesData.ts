type MovieDataType = {
  name: string;
  href: string;
  rating: string;
  languages: string[];
  id: string | null;
};

type UserQueryPayloadType = {
  movieName: string;
  cityName: string;
  date?: string;
  time?: string;
  setNumber?: number;
  language?: string;
  screenType?: string;
};

export type { MovieDataType, UserQueryPayloadType };
