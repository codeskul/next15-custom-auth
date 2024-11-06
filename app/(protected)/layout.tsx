import { getUser } from "@/lib/auth";
import UserProvider from "@/provider/user-provider";
// import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await getUser();

//   const { token, ...rest } = session;
  return (
    <div>
      {/* <Navbar /> */}
      <UserProvider user={session}>{children}</UserProvider>
    </div>
  );
};

export default ProtectedLayout;
