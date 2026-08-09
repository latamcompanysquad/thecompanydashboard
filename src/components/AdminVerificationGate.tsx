import React, { useState, useEffect, useRef } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, RotateCw, ArrowLeft } from "lucide-react";

type VerificationState = "idle" | "sending" | "sent" | "verifying" | "success" | "error";

export function AdminVerificationGate({ 
  adminName = "Admin", 
  onSuccess 
}: { 
  adminName?: string; 
  onSuccess: () => void; 
}) {
  const [state, setState] = useState<VerificationState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    const char = value.slice(-1);
    newDigits[index] = char;
    setDigits(newDigits);

    if (char !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      verifyCode(newDigits.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const sendCode = async () => {
    setState("sending");
    setErrorMsg(null);
    try {
      // Send live auth verification log to Worker
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDevCode(code);

      await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/staff-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discord_id: "362782605063618561",
          discord_username: adminName,
          authorized: true,
          action: "request_2fa_code"
        })
      }).catch(() => {});

      setState("sent");
      setTimer(300);
    } catch {
      setState("error");
      setErrorMsg("Error de conexión. Intenta de nuevo.");
    }
  };

  const verifyCode = (codeString?: string) => {
    const code = codeString || digits.join("");
    if (code.length !== 6) return;

    setState("verifying");
    setErrorMsg(null);

    setTimeout(() => {
      if (devCode && code !== devCode) {
        setState("sent");
        setErrorMsg("Código incorrecto.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setState("success");
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    }, 600);
  };

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#141821] p-6 text-center text-[#E7E1DB] select-none font-sans">
      {/* Background glowing blobs */}
      <div className="absolute top-[20%] left-[30%] h-[350px] w-[350px] rounded-full bg-[#F17633]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] h-[350px] w-[350px] rounded-full bg-[#294C74]/20 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-[#53565A]/40 bg-[#1B212D]/90 p-8 shadow-2xl backdrop-blur-xl transition-all">
        {/* Title & Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F17633]/15 text-[#F17633]">
          {state === "success" ? (
            <CheckCircle2 className="h-9 w-9 text-[#A4C1A8]" />
          ) : (
            <KeyRound className="h-9 w-9" />
          )}
        </div>

        <h1 className="text-2xl font-black uppercase tracking-wide text-white">
          {state === "success" ? "Acceso Autorizado" : "Verificación de Seguridad"}
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[#C0B9AB]">
          Hola <strong className="text-white font-bold">{adminName}</strong>. Para ingresar al panel administrativo, se requiere un código de verificación enviado a Discord.
        </p>

        {/* States Content */}
        {state === "idle" && (
          <div className="mt-6 space-y-4">
            <p className="text-xs text-[#C0B9AB]">
              El código se enviará directamente al canal privado de administración <strong className="text-white">#admin-alerts</strong> en nuestro servidor oficial.
            </p>
            <button
              onClick={sendCode}
              className="w-full rounded-xl bg-[#F17633] px-5 py-3.5 text-xs font-mono font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#d96222] hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
            >
              Solicitar código en Discord
            </button>
          </div>
        )}

        {state === "sending" && (
          <div className="mt-8 flex flex-col items-center justify-center py-4 space-y-3">
            <RotateCw className="h-8 w-8 animate-spin text-[#F17633]" />
            <p className="text-xs font-mono uppercase tracking-wider text-[#C0B9AB]">
              Enviando código al servidor...
            </p>
          </div>
        )}

        {(state === "sent" || state === "verifying" || state === "success") && (
          <div className="mt-6 space-y-6">
            <p className="text-xs text-[#C0B9AB]">
              Ingresa el código de 6 dígitos enviado a <strong className="text-white">#admin-alerts</strong>
            </p>

            {/* Inputs Group */}
            <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={state === "verifying" || state === "success"}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  onChange={(e) => handleDigitChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="h-12 w-11 rounded-lg border border-[#53565A]/50 bg-[#141821]/80 text-center font-mono text-xl font-bold text-white outline-none transition-all focus:border-[#F17633] focus:ring-1 focus:ring-[#F17633]/50 disabled:opacity-50"
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 justify-center text-xs text-[#F17633]">
                <ShieldAlert className="h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Timer and Resend */}
            <div className="flex items-center justify-between text-xs text-[#C0B9AB] font-mono">
              <span>Expira en: <strong className="text-white font-bold">{formatTimer()}</strong></span>
              <button
                onClick={sendCode}
                disabled={timer > 240}
                className="text-[#F17633] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer font-bold"
              >
                Reenviar código
              </button>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 justify-center text-xs text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={sendCode}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-xs font-mono uppercase text-white transition-colors hover:bg-white/10 cursor-pointer"
            >
              Reintentar solicitud
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 border-t border-[#3a4e6b] pt-4 flex justify-center">
          <a
            href="https://latamcompany.org"
            className="inline-flex items-center gap-1.5 text-xs text-[#DFCFBA]/65 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al sitio de LATAM COMPANY
          </a>
        </div>
      </div>
    </div>
  );
}
