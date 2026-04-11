export default function Heading({ title, desc }) {
  return (
    <div className="text-center p-2.5">
      <h2 className="text-text-primary font-black text-2xl md:text-3xl -tracking-[0.75px] mb-2">
        {title}
      </h2>
      <p className="text-text-secondary text-[12px] md:text-sm md:tracking-wider">
        {desc}
      </p>
    </div>
  );
}
