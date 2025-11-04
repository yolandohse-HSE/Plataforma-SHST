import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Dados simulados de utilizadores
const DEMO_USERS = [
  {
    id: "admin-id",
    email: "admin@globalsafety.ao",
    password: "password",
    name: "Administrador Global Safety",
    role: "ADMIN",
    companyId: "gs-company-id",
  },
  {
    id: "tech-id",
    email: "tecnico@empresa.ao",
    password: "password",
    name: "Técnico SHST Exemplo",
    role: "SHST_TECHNICIAN",
    companyId: "client-company-id",
  },
  {
    id: "company-id",
    email: "empresa@cliente.ao",
    password: "password",
    name: "Gestor de Empresa",
    role: "CLIENT_COMPANY",
    companyId: "client-company-id",
  },
];

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Procurar o utilizador nos dados simulados
        const user = DEMO_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          return null;
        }

        // Retornar o objeto de utilizador (incluindo o role)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.role = token.role;
        session.user.companyId = token.companyId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Página de login personalizada
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
