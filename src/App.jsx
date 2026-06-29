import { useState } from "react";

const REPO_URL = "https://github.com/elev1e1nSure/hop";
const RELEASES_URL = `${REPO_URL}/releases`;
const BUCKET_URL = "https://github.com/elev1e1nSure/hop-bucket";
const SCREENSHOT_URL = `${import.meta.env.BASE_URL}hop-screenshot.png`;
const INSTALL_COMMAND = `scoop bucket add hop ${BUCKET_URL}
scoop install hop`;

const flags = [
  ["hop", "open the TUI"],
  ["hop --language en", "force English UI"],
  ["hop --language ru", "force Russian UI"],
  ["hop --path add", "add hop to PATH"],
  ["hop --path remove", "remove hop from PATH"],
  ["hop --help", "print the CLI help"],
];

function ScreenshotSlot() {
  const [hasScreenshot, setHasScreenshot] = useState(true);

  return (
    <figure className="m-0 border border-border-custom bg-bg-raised rounded-[10px] overflow-hidden">
      {hasScreenshot ? (
        <img
          src={SCREENSHOT_URL}
          alt="hop terminal interface screenshot"
          className="block w-full aspect-[16/9] object-cover bg-bg-raised-2"
          onError={() => setHasScreenshot(false)}
        />
      ) : (
        <div className="aspect-[16/9] min-h-[260px] flex items-center justify-center px-6 text-center bg-[linear-gradient(135deg,var(--color-bg-raised),var(--color-bg-raised-2))]">
          <div>
            <p className="font-mono text-accent text-[13px] mb-3">
              screenshot slot
            </p>
            <p className="text-text-dim max-w-[480px] m-0">
              Put the real screenshot at{" "}
              <code className="font-mono text-text-main bg-bg px-1.5 py-0.5 rounded">
                public/hop-screenshot.png
              </code>
              . The site will pick it up on the next build.
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1400);
    });
  };

  return (
    <>
      <main>
        <section className="max-w-[900px] mx-auto px-6 pt-24 pb-14">
          <p className="font-mono text-[13px] text-accent mb-4">
            ssh hosts, without another database
          </p>
          <h1 className="font-mono font-bold text-[clamp(56px,10vw,96px)] leading-[0.95] mb-6">
            hop<span className="inline-block text-accent animate-cursor-blink">_</span>
          </h1>
          <p className="text-[20px] text-text-dim max-w-[650px] mb-9 text-pretty">
            hop is a small terminal app for people who already live in{" "}
            <strong className="text-text-main font-medium">~/.ssh/config</strong>.
            It gives that file a fast fuzzy picker, basic host editing, connection
            history, and a direct jump into regular SSH.
          </p>
          <div className="flex flex-wrap gap-3 font-mono text-[13px] text-text-dim">
            <a
              href="#install"
              className="inline-flex items-center gap-1.5 border border-accent text-accent rounded-[6px] px-4 py-2 no-underline transition hover:bg-accent-soft active:translate-y-px"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              install
            </a>
            <a
              href={RELEASES_URL}
              className="inline-flex items-center gap-1.5 border border-border-custom rounded-[6px] px-4 py-2 no-underline transition hover:border-accent hover:text-accent active:translate-y-px"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" />
                <line x1="7" x2="7.01" y1="7" y2="7" />
              </svg>
              releases
            </a>
            <a
              href={REPO_URL}
              className="inline-flex items-center gap-1.5 border border-border-custom rounded-[6px] px-4 py-2 no-underline transition hover:border-accent hover:text-accent active:translate-y-px"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              source
            </a>
          </div>
        </section>

        <section className="max-w-[900px] mx-auto px-6 pb-20">
          <ScreenshotSlot />
        </section>

        <section className="max-w-[900px] mx-auto px-6 py-16 border-t border-border-custom">
          <div className="grid grid-cols-[1fr_1.25fr] max-[760px]:grid-cols-1 gap-10">
            <div>
              <p className="font-mono text-[13px] text-accent mb-4">
                what it does
              </p>
              <h2 className="font-mono text-[28px] leading-tight m-0">
                A practical front door for SSH hosts.
              </h2>
            </div>
            <div className="text-text-dim text-[16px] leading-7">
              <p className="mt-0">
                It reads your SSH config, shows aliases in a searchable list,
                lets you add/edit/delete hosts, and writes changes back to the
                same file. Existing SSH directives stay yours: aliases,
                IdentityFile, ProxyJump, ports, users.
              </p>
              <p className="mb-0">
                It does not replace SSH and does not ask you to move hosts into a
                cloud account. Pick a host, press Enter, and hop calls the system
                SSH client.
              </p>
            </div>
          </div>
        </section>

        <section
          className="max-w-[900px] mx-auto px-6 py-16 border-t border-border-custom"
          id="install"
        >
          <p className="font-mono text-[13px] text-accent mb-4">install</p>
          <div className="bg-bg-raised border border-border-custom rounded-[10px] p-[18px_20px] flex items-center justify-between gap-4 flex-wrap">
            <div className="font-mono text-[14.5px] text-text-main leading-relaxed">
              <div className="flex items-start">
                <span className="text-text-dim mr-2.5 select-none">$</span>
                <span>scoop bucket add hop {BUCKET_URL}</span>
              </div>
              <div className="flex items-start mt-1.5">
                <span className="text-text-dim mr-2.5 select-none">$</span>
                <span>scoop install hop</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              title={copied ? "copied" : "copy"}
              className={`bg-transparent border border-border-custom rounded-[6px] p-[7px] cursor-pointer transition-all duration-150 ease-in-out hover:border-accent hover:text-accent flex items-center justify-center active:translate-y-px ${copied ? "text-accent border-accent scale-90" : "text-text-dim"}`}
            >
              {copied ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7.5L6 11.5L13 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5"
                    y="1"
                    width="9"
                    height="9"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M10 10V12.5C10 13.0523 9.55228 13.5 9 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V6C1.5 5.44772 1.94772 5 2.5 5H5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-sm text-text-dim mt-4 mx-1">
            Manual path: download a zip from{" "}
            <a
              href={RELEASES_URL}
              className="underline hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              releases
            </a>
            , unpack it, then run{" "}
            <code className="font-mono text-[13px] bg-bg-raised-2 px-1 rounded">
              hop --path add
            </code>
            .
          </p>
        </section>

        <section className="max-w-[900px] mx-auto px-6 py-16 border-t border-border-custom">
          <p className="font-mono text-[13px] text-accent mb-5">flags</p>
          <div className="border border-border-custom rounded-[10px] overflow-hidden">
            {flags.map(([command, description]) => (
              <div
                key={command}
                className="grid grid-cols-[220px_1fr] max-[640px]:grid-cols-1 gap-3 px-5 py-4 border-b border-border-custom last:border-b-0 bg-bg-raised"
              >
                <code className="font-mono text-[14px] text-text-main">
                  {command}
                </code>
                <span className="text-text-dim">{description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[900px] mx-auto px-6 py-16 border-t border-border-custom">
          <p className="font-mono text-[13px] text-accent mb-5">how it works</p>
          <ol className="m-0 p-0 list-none grid gap-3">
            {[
              "Parse ~/.ssh/config and keep the host directives intact.",
              "Filter hosts by alias, user, or address as you type.",
              "Open the selected host through the normal ssh command.",
              "Save edits back to the SSH config when you change hosts in the TUI.",
            ].map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[42px_1fr] gap-4 items-start text-text-dim"
              >
                <span className="font-mono text-accent tabular-nums">
                  0{index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-border-custom py-7 pb-10">
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between gap-4 font-mono text-[12.5px] text-text-dim">
          <span>MIT license</span>
          <a
            href={REPO_URL}
            className="no-underline hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/elev1e1nSure/hop
          </a>
        </div>
      </footer>
    </>
  );
}
