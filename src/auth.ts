import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { prisma } from "@/prisma"
import { hashPassword } from "@/lib/utils"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      name?: string;
      email?: string;
      phone?: string;
      is_verified?: boolean;
      user_id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    user_id?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        try {
          const { sub } = profile;
          let provider = await prisma.user_providers.findFirst({
            where: {
              provider_user_id: sub
            },
            include: {
              user: true
            }
          });

          if (!provider) {

            const userExists = await prisma.users.findFirst({
              where: {
                email: profile.email,
                is_verified: true
              }
            });

            if (userExists) {
              throw new Error("User already exists")
            }

            const user = await prisma.users.create({
              data: {
                email: profile.email,
                name: profile.name,
                role: "user",
                is_verified: true,
              }
            });

            provider = await prisma.user_providers.create({
              data: {
                provider_user_id: sub,
                provider_id: 1,
                user_id: user.user_id
              }

            }).then((provider: any) => {
              return prisma.user_providers.findFirst({
                where: {
                  id: provider.id
                },
                include: {
                  user: true
                }
              });
            });
          }

          if (!provider?.user) {
            throw new Error("Failed to retrieve user data");
          }

          const {
            password: _,
            ...rest
          } = provider.user;

          return {
            user_id: rest.user_id,
            name: rest.name,
            email: rest.email,
            phone: rest.phone,
            role: rest.role,
            is_verified: rest.is_verified,
            created_at: rest.created_at
          };
        } catch (err) {
          console.log(err);
          if (err instanceof Error) {
            console.log(err.message);
          }
          return {
            error: 'Email already in use',
          }
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {

          const { email, password } = signInSchema.parse(credentials)

          const user = await prisma.users.findFirst({
            where: {
              email,
              is_verified: true
            }
          })

          if (!user) {
            throw new Error('Usuario usuario y/o contraseña incorrectos')
          }

          const hashedPassword = hashPassword(password)

          if (user.password !== hashedPassword) {
            throw new Error('Usuario usuario y/o contraseña incorrectos')
          }

          const {
            password: _,
            ...rest
          } = user


          return rest

        } catch (err) {
          console.log(err)
          if (err instanceof ZodError) {
            console.log(err.errors)
          } else if (err instanceof Error) {
            console.log(err.message)
          }
          return {
            error: 'Usuario usuario y/o contraseña incorrectos',
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.user_id = user.user_id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      session.user.user_id = token.user_id as string
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.phone = token.phone as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
})
