export const PORT = 5000; // default porti per html live server eshte 8000, nese ju duhet porti i back-ut mu ndrru mos e leni 8000

export const DB_LINK = 'mongodb+srv://genthetemi7:QGVSLmD0K2MRiVEx@sign-language-app.uydey.mongodb.net/?retryWrites=true&w=majority&appName=Sign-Language-App'

const config = {
    JWT_SECRET: 'starlabs-jwt-secret', 
    TOKEN_EXPIRATION: '1h',            

    REFRESH_TOKEN_SECRET: 'starlabs-jwtRefresh-secret',
    REFRESH_TOKEN_EXPIRATION: '7d',
};
export default config;
  