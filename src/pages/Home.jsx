import CreatePostForm from "../components/CreatePostForm";
import Feed from "../components/Feed";

export default function Home() {
  return (
    <div className="w-full">
      <div className="mx-auto mt-5 flex w-full max-w-4xl flex-col gap-10">
        <CreatePostForm />
        <Feed />
      </div>
    </div>
  );
}
