declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_FRONTEND_URL: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
  DATABASE_URL = "mysql://root:@localhost:3306/shop_db"
  JWT_TOKEN_SECRET_KEY = "3T2H35}3j![4.SG\nB{kRJ\%Pfvy}CmY"
  NEXT_PUBLIC_FRONTEND_URL = "https://nomadautomobile.store"
  UPLOADTHING_TOKEN = 'eyJhcGlLZXkiOiJza19saXZlXzVlMmEyNzAyNjBlZGE0ZjI2MzVjMzJkNmU0MzBmZmRjMDNmZmRiMmM4NmU5YjdlN2NmM2ExOGM0NTc1MTQ1NjciLCJhcHBJZCI6ImZtbDF1ajl6cjYiLCJyZWdpb25zIjpbInNlYTEiXX0='
  CLOUDINARY_CLOUD_NAME = diyxdjcma
  CLOUDINARY_API_KEY = 398366532816213
  CLOUDINARY_API_SECRET = AaCvabfRsOY9H4ANyYvJs5rqVrI
}

