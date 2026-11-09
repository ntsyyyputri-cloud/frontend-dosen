import { redirect } from "next/navigation";

export default function DosenRootRedirect() {
  redirect("/dosen/dashboard");
}

