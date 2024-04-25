import { Appbar } from "@/components/Appbar";
import { auth } from "@/lib/auth";

async function getUser() {
  const session = auth();
  return session;
}

export default async function Home() {
  const session = await getUser();

  return (
    <div>
      <Appbar />
      {JSON.stringify(session)}
    </div>
  );
}
