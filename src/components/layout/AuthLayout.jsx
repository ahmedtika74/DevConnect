export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden py-5">
      <div className="absolute -top-32 -left-25.5 -z-1 h-96 w-lg bg-[radial-gradient(ellipse_64.03%_80.04%_at_50.00%_50.00%,rgba(77,142,255,0.15)_0%,rgba(77,142,255,0)_70%)]" />
      <div className="absolute -right-25.5 -bottom-32 -z-1 h-96 w-lg bg-[radial-gradient(ellipse_64.03%_80.04%_at_50.00%_50.00%,rgba(77,142,255,0.15)_0%,rgba(77,142,255,0)_70%)] opacity-50" />
      <div className="absolute top-0 left-0 -z-1 h-full w-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 -right-32 -z-1 h-125 w-125 rounded-full bg-violet-800 mix-blend-screen blur-md lg:blur-3xl" />
        <div className="absolute top-1/4 -left-32 -z-1 h-125 w-125 rounded-full bg-blue-500 mix-blend-screen blur-md lg:blur-3xl" />
      </div>
      <div>
        <h1 className="bg-linear-to-r from-[#D0BCFF] to-[#D0BCFF] bg-clip-text p-8 text-3xl font-bold text-transparent md:text-4xl">
          DevConnect
        </h1>
      </div>
      {children}
    </div>
  );
}
