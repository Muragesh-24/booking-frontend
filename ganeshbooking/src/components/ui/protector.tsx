import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_API_URL}/verifytoken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          router.replace("/auth");
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
    return <div>Loading...</div>; // or a spinner
  }

  return <>{children}</>;
}
