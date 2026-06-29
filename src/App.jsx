import React, { useState, useRef } from "react";

const servers = [
  { name: "prod-api-01", user: "deploy", host: "10.0.4.12", online: true },
  { name: "prod-api-02", user: "deploy", host: "10.0.4.13", online: true },
  { name: "staging-web", user: "ubuntu", host: "10.0.9.40", online: true },
  { name: "db-primary",  user: "postgres", host: "10.0.1.5", online: true },
  { name: "db-replica",  user: "postgres", host: "10.0.1.6", online: false },
  { name: "bastion",     user: "ec2-user", host: "203.0.113.7", online: true },
  { name: "home-nas",    user: "admin", host: "192.168.1.20", online: false },
  { name: "vps-personal", user: "root", host: "45.33.12.9", online: true },
];

function fuzzyMatch(query, text) {
  if (!query) return { match: true, ranges: [] };
  let qi = 0;
  const ranges = [];
  const queryTrimmed = query.trim();
  if (!queryTrimmed) return { match: true, ranges: [] };

  for (let ti = 0; ti < text.length && qi < queryTrimmed.length; ti++) {
    if (text[ti].toLowerCase() === queryTrimmed[qi].toLowerCase()) {
      ranges.push(ti);
      qi++;
    }
  }
  return { match: qi === queryTrimmed.length, ranges };
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [connectingIndex, setConnectingIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  // Compute filtered servers
  const filteredServers = servers
    .map((s) => ({ s, ...fuzzyMatch(query, s.name) }))
    .filter((r) => r.match);

  const activeServer = filteredServers[activeIndex]?.s ?? null;

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredServers.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Escape") {
      setQuery("");
      setActiveIndex(0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (
        filteredServers.length > 0 &&
        activeIndex >= 0 &&
        activeIndex < filteredServers.length
      ) {
        setConnectingIndex(activeIndex);
        setTimeout(() => {
          setConnectingIndex(null);
        }, 220);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("go build && ./hop").then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1400);
    });
  };

  const renderHighlightedName = (name, ranges) => {
    if (!ranges.length) return name;
    return name.split("").map((char, index) => {
      if (ranges.includes(index)) {
        return (
          <mark key={index} className="bg-none text-accent font-semibold">
            {char}
          </mark>
        );
      }
      return char;
    });
  };

  return (
    <>
<main>
        <section className="max-w-[880px] mx-auto px-6 pt-24 pb-16">
<h1 className="font-mono font-bold text-[clamp(56px,10vw,96px)] max-[720px]:text-[56px] leading-[0.95] mb-5 tracking-[-0.01em]">
            hop<span className="inline-block text-accent animate-cursor-blink">_</span>
          </h1>
          <p className="text-[19px] text-text-dim max-w-[560px] mb-12">
            Читает <strong className="text-text-main font-medium">~/.ssh/config</strong>, показывает список хостов, подключает куда скажешь. Больше ничего не делает.
          </p>

          <div className="bg-bg-raised border border-border-custom rounded-[10px] overflow-hidden shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]">
            <div className="p-6 pb-7 font-mono text-[15px] text-left flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-[18px]">
                  <span className="text-accent">&gt;</span>
                  <input
                    ref={inputRef}
                    id="fuzzy-input"
                    type="text"
                    placeholder="начни печатать..."
                    autoComplete="off"
                    spellCheck="false"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-0 border-none text-text-main font-mono text-[15px] outline-none outline-0 ring-0 shadow-none focus:outline-none focus:outline-0 focus:ring-0 focus:border-0 focus:shadow-none caret-accent appearance-none"
                  />
                </div>
                <ul className="list-none m-0 p-0 flex flex-col gap-0.5" id="fuzzy-list">
                  {filteredServers.length > 0 ? (
                    filteredServers.map((item, index) => {
                      const isConnecting = connectingIndex === index;
                      const isActive = activeIndex === index;
                      return (
                        <li
                          key={item.s.name}
                          onClick={() => {
                            setActiveIndex(index);
                            inputRef.current?.focus();
                          }}
                          style={{
                            transition: "opacity .15s ease",
                            opacity: isConnecting ? 0.3 : 1,
                          }}
                          className={`flex items-center justify-between py-[6px] px-2.5 rounded-md cursor-pointer transition-colors duration-120 ease-in-out ${
                            isActive ? "bg-accent-soft text-accent" : "text-text-main"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.s.online ? "bg-[#4ade80]" : "bg-border-custom"}`} />
                            {renderHighlightedName(item.s.name, item.ranges)}
                          </span>
                          <span className="text-xs text-text-dim opacity-80 ml-4">
                            {item.s.user}@{item.s.host}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-xs text-text-dim opacity-80 py-[7px] px-2.5">
                      ничего не найдено
                    </li>
                  )}
                </ul>
                <div className="mt-4 text-xs text-text-dim flex gap-4 flex-wrap">
                  {[["↑↓", "выбор"], ["↵", "подключиться"], ["esc", "очистить"]].map(([key, label]) => (
                    <span key={key}>
                      <kbd className="font-mono bg-bg-raised-2 border border-border-custom rounded px-1.5 py-0.25 text-[11px]">{key}</kbd>{" "}{label}
                    </span>
                  ))}
                </div>
              </div>

              {activeServer && (
                <div className="w-[175px] flex-shrink-0 border border-border-custom rounded-lg p-4 text-[12px] self-start">
                  <p className="text-accent font-semibold mb-3 text-[13px] truncate">{activeServer.name}</p>
                  {[
                    ["Host", activeServer.host],
                    ["User", activeServer.user],
                    ["Port", "22"],
                    ["Status", activeServer.online ? "online" : "offline"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 mb-1.5">
                      <span className="text-text-dim">{k}</span>
                      <span className={k === "Status" ? (activeServer.online ? "text-[#4ade80]" : "text-text-dim") : "text-text-main"}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-[880px] mx-auto px-6 py-20 border-t border-border-custom" id="install">
          <p className="font-mono text-[13px] text-text-dim mb-4">install</p>
          <div className="bg-bg-raised border border-border-custom rounded-[10px] p-[18px_20px] flex items-center justify-between gap-4 flex-wrap">
            <div className="font-mono text-[14.5px] text-text-main">
              <span className="text-text-dim mr-2.5">$</span>go build && ./hop
            </div>
            <button
              onClick={handleCopy}
              title={copied ? "скопировано" : "скопировать"}
              className={`bg-transparent border border-border-custom rounded-[6px] p-[7px] cursor-pointer transition-all duration-150 ease-in-out hover:border-accent hover:text-accent flex items-center justify-center ${copied ? "text-accent border-accent scale-90" : "text-text-dim"}`}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7.5L6 11.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M10 10V12.5C10 13.0523 9.55228 13.5 9 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V6C1.5 5.44772 1.94772 5 2.5 5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
          <p className="text-sm text-text-dim mt-4 mx-1">
            Пока без <code>go install</code> — склонируй репо и собери локально.
          </p>
        </section>

        <section className="max-w-[880px] mx-auto px-6 py-20 border-t border-border-custom">
          <div className="grid grid-cols-3 max-[720px]:grid-cols-1 gap-[1px] bg-border-custom border border-border-custom rounded-xl overflow-hidden">
            <div className="bg-bg py-[28px] px-6">
              <p className="font-mono text-[13px] text-accent mb-3.5">--no-cloud</p>
              <p className="m-0 text-text-dim text-[15px]">
                Хосты хранятся там, где ты их уже держишь — в{" "}
                <strong className="text-text-main font-medium">~/.ssh/config</strong>.
                hop их оттуда просто читает.
              </p>
            </div>
            <div className="bg-bg py-[28px] px-6">
              <p className="font-mono text-[13px] text-accent mb-3.5">--instant</p>
              <p className="m-0 text-text-dim text-[15px]">
                Бинарник на Go без рантайма. Нет момента «подожди, запускается».
              </p>
            </div>
            <div className="bg-bg py-[28px] px-6">
              <p className="font-mono text-[13px] text-accent mb-3.5">--just-ssh</p>
              <p className="m-0 text-text-dim text-[15px]">
                hop не реализует ssh — он его вызывает. Поэтому всё, что работало
                раньше, работает и сейчас.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-[880px] mx-auto px-6 py-20 border-t border-border-custom">
          <div className="flex items-center justify-between mb-5 font-mono text-[13px]">
            <span className="text-text-dim">без hop</span>
            <span className="text-accent">с hop</span>
          </div>
          <div className="grid grid-cols-2 max-[720px]:grid-cols-1 gap-[1px] bg-border-custom border border-border-custom rounded-xl overflow-hidden">
            <div className="bg-bg py-[28px] px-6">
              <p className="font-mono text-[12px] text-text-dim mb-4">~/.ssh/config</p>
              <pre className="font-mono text-[13px] leading-[1.7] m-0 text-text-dim overflow-x-auto">{`Host prod-api-01
  HostName 10.0.4.12
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host prod-api-02
  HostName 10.0.4.13
  User deploy
  IdentityFile ~/.ssh/id_ed25519

Host staging-web
  HostName 10.0.9.40
  User ubuntu
  ProxyJump bastion

Host bastion
  HostName 203.0.113.7
  User ec2-user

Host db-primary
  HostName 10.0.1.5
  User postgres
  ProxyJump bastion`}</pre>
            </div>
            <div className="bg-bg-raised py-[28px] px-6 flex gap-3">
              <div className="flex-1 font-mono text-[13px]">
                <p className="text-text-dim text-[12px] mb-4">$ hop</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-accent">&gt;</span>
                  <span className="text-text-dim">pro<span className="text-accent font-semibold">d</span></span>
                </div>
                {[
                  { name: "prod-api-01", user: "deploy", host: "10.0.4.12", online: true, active: true },
                  { name: "prod-api-02", user: "deploy", host: "10.0.4.13", online: true, active: false },
                ].map((s) => (
                  <div
                    key={s.name}
                    className={`flex items-center justify-between py-[5px] px-2.5 rounded-md ${s.active ? "bg-accent-soft text-accent" : "text-text-dim"}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0" />
                      {s.name}
                    </span>
                    <span className="text-xs opacity-60">{s.user}@{s.host}</span>
                  </div>
                ))}
              </div>
              <div className="w-[140px] flex-shrink-0 border border-border-custom rounded-lg p-3 text-[11px] font-mono self-start">
                <p className="text-accent font-semibold mb-2">prod-api-01</p>
                {[["Host", "10.0.4.12"], ["User", "deploy"], ["Port", "22"], ["Status", "online"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-1 mb-1">
                    <span className="text-text-dim">{k}</span>
                    <span className={k === "Status" ? "text-[#4ade80]" : "text-text-main"}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-border-custom py-7 pb-10">
        <div className="max-w-[880px] mx-auto px-6 flex items-center justify-between font-mono text-[12.5px] text-text-dim">
          <span>MIT license</span>
          <a href="#" className="no-underline hover:text-accent">
            github.com/you/hop
          </a>
        </div>
      </footer>
    </>
  );
}
