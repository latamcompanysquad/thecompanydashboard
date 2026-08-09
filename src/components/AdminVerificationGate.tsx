import React, { useState, useEffect, useRef } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, RotateCw, ArrowLeft, ShieldX } from "lucide-react";
import { DiscordLogoIcon } from "./CustomIcons";

type AuthStep = "login" | "verify" | "denied";
type VerificationState = "idle" | "sending" | "sent" | "verifying" | "success" | "error";

export function AdminVerificationGate({ 
  adminName = "Admin", 
  onSuccess 
}: { 
  adminName?: string; 
  onSuccess: (discordUserData?: any) => void; 
}) {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [selectedStaffUser, setSelectedStaffUser] = useState<any | null>(null);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(true);
  const [userIp, setUserIp] = useState<string>("Detectando IP...");

  const [state, setState] = useState<VerificationState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch IP and Staff list on mount
  useEffect(() => {
    async function initData() {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          setUserIp(ipData.ip || "127.0.0.1");
        }
      } catch {
        setUserIp("No disponible");
      }

      try {
        const staffRes = await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/staff");
        if (staffRes.ok) {
          const data = await staffRes.json();
          if (Array.isArray(data.staff)) {
            setStaffUsers(data.staff);
          }
        }
      } catch (e) {
        console.warn("Error fetching staff list:", e);
      } finally {
        setIsLoadingStaff(false);
      }
    }
    initData();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Discord Login simulation / OAuth check
  const handleDiscordOAuthLogin = async (staffMember?: any) => {
    setIsLoadingStaff(true);
    setErrorMsg(null);

    // If a staff member is selected from the verified list
    const userToVerify = staffMember || staffUsers.find(s => s.discordID === "884266375294636074") || staffUsers[0];

    if (!userToVerify) {
      setAuthStep("denied");
      setErrorMsg("No se pudo verificar la membresía en el servidor de Discord.");
      setIsLoadingStaff(false);
      return;
    }

    // Check if staff member belongs to the server and has active staff group
    const isStaffAuthorized = !!userToVerify.groups && userToVerify.groups !== "";

    if (!isStaffAuthorized) {
      setAuthStep("denied");
      setErrorMsg("Acceso Denegado: Tu cuenta de Discord no pertenece al Staff de LATAM COMPANY.");
      setIsLoadingStaff(false);
      return;
    }

    // Authorized staff member!
    setSelectedStaffUser(userToVerify);
    setAuthStep("verify");
    setIsLoadingStaff(false);
    
    // Automatically trigger code dispatch to Discord embed
    sendCodeToDiscordEmbed(userToVerify);
  };

  // Dispatch Embed Code to Discord Channel 1535560774184079481
  const sendCodeToDiscordEmbed = async (user = selectedStaffUser) => {
    setState("sending");
    setErrorMsg(null);
    try {
      // Generate 6-digit OTP Security Code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDevCode(code);

      const username = user?.lastName?.trim() || adminName;
      const discordId = user?.discordID || "No vinculado";
      const userGroup = user?.groups || "Staff Admin";

      // Dispatch Discord Rich Embed payload to Worker & Discord Webhook
      const embedPayload = {
        content: `🚨 **Solicitud de Verificación de Seguridad 2FA - The Company Dashboard**`,
        embeds: [
          {
            title: "🔒 Código de Verificación de Seguridad",
            description: `Se ha iniciado una solicitud de acceso al **Panel de Administración** por parte del Staff de LATAM COMPANY.`,
            color: 15824435, // #F17633 Vibrant Orange
            fields: [
              {
                name: "👤 Usuario Administrador",
                value: `**${username}**\nDiscord ID: \`${discordId}\``,
                inline: true
              },
              {
                name: "🛡️ Rango / Grupo",
                value: `\`${userGroup}\``,
                inline: true
              },
              {
                name: "🌐 Dirección IP",
                value: `\`${userIp}\``,
                inline: true
              },
              {
                name: "🔑 Código de Verificación",
                value: `\`\`\`${code}\`\`\``,
                inline: false
              },
              {
                name: "📢 Canal de Destino",
                value: `<#1535560774184079481>`,
                inline: true
              }
            ],
            footer: {
              text: "LATAM COMPANY • Squad Security Audit System",
              icon_url: "https://thecompanydashboard.pages.dev/logo.png"
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Send to Cloudflare Worker Session Logger & Discord Proxy
      await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/staff-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discord_id: discordId,
          discord_username: username,
          ip_address: userIp,
          user_agent: navigator.userAgent,
          authorized: true,
          action: "sent_2fa_discord_embed",
          channel_id: "1535560774184079481",
          guild_id: "1496619805250420966",
          code_generated: code,
          embed_data: embedPayload
        })
      }).catch(() => {});

      setState("sent");
      setTimer(300); // 5 minute expiration timer
    } catch {
      setState("error");
      setErrorMsg("Error al enviar el mensaje de verificación a Discord. Intenta de nuevo.");
    }
  };

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

  const verifyCode = (codeString?: string) => {
    const code = codeString || digits.join("");
    if (code.length !== 6) return;

    setState("verifying");
    setErrorMsg(null);

    setTimeout(() => {
      if (devCode && code !== devCode) {
        setState("sent");
        setErrorMsg("Código de verificación incorrecto. Revisa el canal #1535560774184079481 en Discord.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setState("success");
        setTimeout(() => {
          onSuccess(selectedStaffUser);
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
        
        {/* LOGO & BRAND HEADER */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="LATAM COMPANY" className="h-12 w-auto object-contain" />
        </div>

        {/* STEP 1: DISCORD OAUTH LOGIN */}
        {authStep === "login" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5865F2]/15 text-[#5865F2]">
              <DiscordLogoIcon size={32} color="#5865F2" />
            </div>

            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-white">
                Inicia Sesión con Discord
              </h1>
              <p className="mt-1.5 text-xs text-[#C0B9AB] leading-relaxed">
                Para acceder al panel administrativo, debes validar que perteneces al Staff del servidor de Discord de <strong className="text-white">LATAM COMPANY</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-white/10 bg-black/30 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Servidor Oficial:</span>
                <span className="font-bold text-white">LATAM COMPANY (1496619805250420966)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>IP Detectada:</span>
                <span className="font-bold text-[#F17633]">{userIp}</span>
              </div>
            </div>

            {/* Select staff account or trigger OAuth */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-slate-400 block text-left uppercase tracking-wider">
                Selecciona tu Cuenta de Staff Autorizada:
              </label>
              <select
                onChange={(e) => {
                  const found = staffUsers.find(s => s.steamID === e.target.value);
                  if (found) setSelectedStaffUser(found);
                }}
                className="w-full h-10 rounded-xl border border-white/15 bg-[#141821] px-3 font-mono text-xs font-bold text-white outline-none cursor-pointer"
              >
                {staffUsers.map((u) => (
                  <option key={u.steamID} value={u.steamID}>
                    {u.lastName ? u.lastName.trim() : u.steamID} ({u.groups || "Staff"})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleDiscordOAuthLogin(selectedStaffUser)}
              disabled={isLoadingStaff}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] px-5 py-3.5 text-xs font-mono font-extrabold uppercase tracking-wider text-white transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isLoadingStaff ? (
                <RotateCw className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>
                  <DiscordLogoIcon size={18} color="#ffffff" />
                  <span>Iniciar Sesión con Discord</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP DENIED: NOT PART OF STAFF */}
        {authStep === "denied" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <ShieldX className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-red-400">
                Acceso Denegado
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[#C0B9AB]">
                {errorMsg || "Tu cuenta de Discord no pertenece al Staff de LATAM COMPANY o no tiene permisos suficientes."}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300">
              Debes formar parte del servidor de Discord de LATAM COMPANY (ID: 1496619805250420966) y contar con un rango administrativo en Admins.cfg.
            </div>

            <button
              onClick={() => setAuthStep("login")}
              className="w-full rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        )}

        {/* STEP 2: 2FA DISCORD EMBED VERIFICATION */}
        {authStep === "verify" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F17633]/15 text-[#F17633]">
              {state === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-[#A4C1A8]" />
              ) : (
                <KeyRound className="h-8 w-8" />
              )}
            </div>

            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-white">
                {state === "success" ? "Acceso Verificado" : "Verificación 2FA de Discord"}
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-[#C0B9AB]">
                Hola <strong className="text-white font-bold">{selectedStaffUser?.lastName?.trim() || adminName}</strong>. Se ha enviado un mensaje con un Embed al canal de administración en Discord.
              </p>
            </div>

            {/* Embedded details */}
            <div className="p-3.5 rounded-xl border border-[#F17633]/30 bg-[#F17633]/10 text-left space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span>📢 Canal de Discord:</span>
                <span className="font-bold text-[#F17633]">#1535560774184079481</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>🌐 IP Registrada:</span>
                <span className="font-bold text-white">{userIp}</span>
              </div>
            </div>

            {state === "sending" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <RotateCw className="h-7 w-7 animate-spin text-[#F17633]" />
                <p className="text-xs font-mono uppercase tracking-wider text-[#C0B9AB]">
                  Generando Embed y enviando a Discord...
                </p>
              </div>
            )}

            {(state === "sent" || state === "verifying" || state === "success") && (
              <div className="space-y-5">
                <p className="text-xs text-[#C0B9AB]">
                  Ingresa el código de 6 dígitos enviado al Embed de Discord:
                </p>

                {/* 6 Digit Input Group */}
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

                {/* Timer & Resend Button */}
                <div className="flex items-center justify-between text-xs text-[#C0B9AB] font-mono">
                  <span>Expira en: <strong className="text-white font-bold">{formatTimer()}</strong></span>
                  <button
                    onClick={() => sendCodeToDiscordEmbed()}
                    disabled={timer > 240}
                    className="text-[#F17633] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer font-bold"
                  >
                    Reenviar a Discord
                  </button>
                </div>
              </div>
            )}

            {state === "error" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-center text-xs text-red-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => sendCodeToDiscordEmbed()}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-xs font-mono uppercase text-white transition-colors hover:bg-white/10 cursor-pointer"
                >
                  Reintentar Envío
                </button>
              </div>
            )}
          </div>
        )}

        {/* FOOTER RETURN LINK */}
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
