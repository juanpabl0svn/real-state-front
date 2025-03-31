import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { prisma } from "@/prisma"
import { hashPassword } from "@/lib/utils"

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
                user_id: user.id
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            password: _,
            ...rest
          } = provider.user;

          return {
            id: rest.id,
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
          throw new Error("Failed to process profile");
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
              email
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  }
})
