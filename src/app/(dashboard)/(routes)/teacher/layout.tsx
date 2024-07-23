import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const revalidate = 0;

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
