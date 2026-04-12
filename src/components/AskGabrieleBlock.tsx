const diamond = " ◆ ";

export default function AskGabrieleBlock({ commands }: { commands: string[] }) {
  return (
    <div className="mt-12 max-w-4xl mx-auto text-center px-4">
      <p className="font-display text-lg md:text-xl font-semibold tracking-wide text-gradient-gold mb-3">
        Ask Gabriele:
      </p>
      <p
        className="font-body text-sm md:text-base leading-relaxed"
        style={{ color: "hsl(30,20%,35%)", fontWeight: 300 }}
      >
        {commands.map((cmd, i) => (
          <span key={i}>
            {cmd}
            {i < commands.length - 1 && (
              <span style={{ color: "hsl(38,55%,48%)" }}>{diamond}</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
