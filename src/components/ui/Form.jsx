export default function Form({ children, handleSubmit }) {
  return (
    <form
      className="bg-glass/60 outline-stroke/15 w-[90%] max-w-100 rounded-xl p-10"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {children}
    </form>
  );
}
