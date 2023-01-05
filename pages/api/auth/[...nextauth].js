//https://blog.openreplay.com/user-authentication-with-google-next-auth/

import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],

  jwt: {
    encryption: true
  },

  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({token, account, profile}){
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile.id;
      }
      return token;
    },

    async session({session, token}){
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    }
  }
});

