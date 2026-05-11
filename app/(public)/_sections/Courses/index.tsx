import { MOCK_COURSES } from "@/lib/mock-data";
import CoursesClient from "./CoursesClient";

export default function Courses(): React.JSX.Element {
  return <CoursesClient courses={MOCK_COURSES} />;
}
