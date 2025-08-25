import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.replace("/adminauth");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/verifyadmintoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        });

        if (!res.ok) {
          router.replace("/adminauth");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.log(err)
      }
    };

    verifyToken();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; /////////////////@@@@@@@@@@@@@@@@must improve it
  }

  return <>{children}</>;
}
