export interface LinkedInProfile {
  provider: string;
  email: string;
  displayName: string;
  picture?: string;
}

export interface GoogleProfile {
  email: string;
  name: string;
  photo?: string;
  accessToken?: string;
}
