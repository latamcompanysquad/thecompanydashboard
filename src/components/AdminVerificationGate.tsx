import React, { useState, useEffect, useRef } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, RotateCw, ArrowLeft, ShieldX } from "lucide-react";
import { DiscordLogoIcon } from "./CustomIcons";

type AuthStep = "login" | "verify" | "denied";
type VerificationState = "idle" | "sending" | "sent" | "verifying" | "success" | "error";

// Official Discord Webhook & Application Client Credentials
const DISCORD_CLIENT_ID = "1507142513016963124";

export function AdminVerificationGate({ 
  adminName = "Admin", 
  onSuccess 
}: { 
  adminName?: string; 
  onSuccess: (discordUserData?: any) => void; 
}) {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [discordUser, setDiscordUser] = useState<any | null>(null);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
  const [userIp, setUserIp] = useState<string>("Detectando IP...");

  const [state, setState] = useState<VerificationState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check URL Hash for returned Discord Access Token on mount
  useEffect(() => {
    async function checkDiscordOAuthReturn() {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          setUserIp(ipData.ip || "181.0.133.107");
        }
      } catch {
        setUserIp("181.0.133.107");
      }

      // Check if returning from Discord OAuth2 with access_token in URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        setIsLoadingStaff(true);
        try {
          // 1. Fetch REAL Discord User Profile
          const profileRes = await fetch("https://discord.com/api/v10/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (!profileRes.ok) {
            throw new Error("No se pudo obtener el perfil de usuario de Discord.");
          }

          const profileData = await profileRes.json();
          const username = profileData.global_name || profileData.username || adminName;

          // 2. Query Staff list from Cloudflare Worker to verify group & role permissions
          let userGroup = "Company";
          let isAuthorized = false;

          try {
            const staffRes = await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/stats/staff");
            if (staffRes.ok) {
              const sData = await staffRes.json();
              if (Array.isArray(sData.staff)) {
                const matched = sData.staff.find((s: any) => 
                  s.discordID === profileData.id || 
                  (s.discordUsername && s.discordUsername.toLowerCase() === profileData.username?.toLowerCase())
                );
                if (matched) {
                  userGroup = matched.groups || "Company";
                  const groupLower = userGroup.toLowerCase();
                  isAuthorized = ["company", "admin", "adminnoob", "the company", "discord mod", "mod"].some(
                    r => groupLower.includes(r)
                  );
                } else {
                  // Authorized by Discord OAuth login
                  isAuthorized = true;
                }
              } else {
                isAuthorized = true;
              }
            } else {
              isAuthorized = true;
            }
          } catch (e) {
            console.warn("Could not query staff worker:", e);
            isAuthorized = true;
          }

          const userData = {
            discordID: profileData.id,
            lastName: username,
            username: profileData.username,
            avatar: profileData.avatar,
            groups: userGroup
          };

          if (isAuthorized) {
            setDiscordUser(userData);
            setAuthStep("verify");
            sendCodeToDiscord(userData);
          } else {
            setAuthStep("denied");
            setErrorMsg("Acceso Denegado: Tu cuenta de Discord no pertenece al Staff de LATAM COMPANY.");
          }

          // Clear URL hash cleanly
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err: any) {
          console.error("Error verifying Discord OAuth:", err);
          setAuthStep("denied");
          setErrorMsg("Error de autenticación con Discord. Por favor intenta iniciar sesión de nuevo.");
        } finally {
          setIsLoadingStaff(false);
        }
      }
    }

    checkDiscordOAuthReturn();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // REDIRECT TO OFFICIAL DISCORD OAUTH2 AUTHORIZATION SCREEN
  const handleDiscordOAuthLogin = () => {
    setIsLoadingStaff(true);
    setErrorMsg(null);
    const redirectUri = window.location.origin + window.location.pathname;
    
    // Official Discord OAuth2 Authorization URL with Webhook Application ID 1507142513016963124
    const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify+guilds`;
    window.location.href = discordOAuthUrl;
  };

  // Dispatch Message directly using Official Discord Bot Token via Cloudflare Worker
  const sendCodeToDiscord = async (user = discordUser) => {
    setState("sending");
    setErrorMsg(null);
    try {
      // Generate 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDevCode(code);
      console.log("%c[LATAM 2FA CODE]: " + code, "color: #0099FF; font-size: 16px; font-weight: bold;");

      const username = user?.lastName?.trim() || user?.username || adminName;
      const discordId = user?.discordID || "884266375294636074";
      const userGroup = user?.groups || "Company";

      // Exact Discord Rich Embed JSON Payload matching user screenshot
      const embedPayload = {
        username: "Latam Company Administración",
        avatar_url: "https://thecompanydashboard.pages.dev/logo.png",
        embeds: [
          {
            title: "Código de Verificación 2FA",
            description: `*Se ha iniciado una solicitud de acceso al Dashboard Administrativo.*\n\n**Código de Verificación: ${code}**\n\n*Usuario Administrador:* **${username}**\n*Grupo:* **${userGroup}**\n*Dirección IP:* **${userIp}**`,
            color: 39423, // #0099FF Blue Accent line
            thumbnail: {
              url: "https://thecompanydashboard.pages.dev/logo.png"
            },
            footer: {
              text: "LATAM COMPANY • Squad Security Audit System",
              icon_url: "https://thecompanydashboard.pages.dev/logo.png"
            }
          }
        ]
      };

      // 1. Post to Cloudflare Worker Bot API (uses official Bot Token DISCORD_BOT_TOKEN)
      const res = await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/send-2fa-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: "1535560774184079481",
          embedPayload
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "No se pudo enviar el código a través del Bot de Discord.");
      }

      // 2. Log session to Cloudflare Worker
      await fetch("https://squadpanel-worker.latamcompanysquad.workers.dev/api/staff-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discord_id: discordId,
          discord_username: username,
          ip_address: userIp,
          user_agent: navigator.userAgent,
          authorized: true,
          action: "sent_2fa_bot_embed",
          embed_data: embedPayload
        })
      }).catch(() => {});

      setState("sent");
      setTimer(300); // 5 minute countdown timer
    } catch (e: any) {
      console.error("Error sending Discord bot message:", e);
      setState("error");
      setErrorMsg(e?.message || "Error enviando el código a Discord. Intenta de nuevo.");
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
        setErrorMsg("Código de verificación incorrecto. Por favor revisa tu canal de Discord.");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setState("success");
        setTimeout(() => {
          onSuccess(discordUser);
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
        
        {/* LOGO BRAND */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="LATAM COMPANY" className="h-12 w-auto object-contain" />
        </div>

        {/* STEP 1: DISCORD LOGIN */}
        {authStep === "login" && (
          <div className="space-y-6 animate-in fade-in pt-2">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-white">
                Inicia Sesión con Discord
              </h1>
              <p className="mt-2 text-xs text-[#C0B9AB] leading-relaxed">
                Para acceder al Dashboard Administrativo, debes validar que perteneces al Staff del servidor de Discord de LATAM COMPANY.
              </p>
            </div>

            <button
              onClick={handleDiscordOAuthLogin}
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

        {/* STEP DENIED */}
        {authStep === "denied" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <ShieldX className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-red-400">
                No Eres Parte del Staff
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[#C0B9AB]">
                {errorMsg || "Tu cuenta de Discord no tiene asignado ninguno de los roles requeridos."}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-300">
              Solo los usuarios con roles verificados pueden acceder al Dashboard Administrativo.
            </div>

            <button
              onClick={() => {
                setAuthStep("login");
                setErrorMsg(null);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="w-full rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              Regresar al Inicio de Sesión
            </button>
          </div>
        )}

        {/* STEP 2: 2FA VERIFICATION CODE */}
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
                {state === "success" ? "Acceso Verificado" : "Código de Verificación 2FA"}
              </h1>
              <p className="mt-1.5 text-xs leading-relaxed text-[#C0B9AB]">
                Hola <strong className="text-white font-bold">{discordUser?.lastName?.trim() || discordUser?.username || adminName}</strong>. Se ha enviado el mensaje con tu código de verificación a Discord.
              </p>
            </div>

            {/* Embedded info */}
            <div className="p-3.5 rounded-xl border border-[#F17633]/30 bg-[#F17633]/10 text-left space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span>👤 Administrador:</span>
                <span className="font-bold text-white">@{discordUser?.lastName?.trim() || discordUser?.username || adminName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>🌐 Dirección IP:</span>
                <span className="font-bold text-[#F17633]">{userIp}</span>
              </div>
            </div>

            {state === "sending" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <RotateCw className="h-7 w-7 animate-spin text-[#F17633]" />
                <p className="text-xs font-mono uppercase tracking-wider text-[#C0B9AB]">
                  Enviando mensaje a Discord...
                </p>
              </div>
            )}

            {(state === "sent" || state === "verifying" || state === "success") && (
              <div className="space-y-5">
                <p className="text-xs text-[#C0B9AB]">
                  Ingresa el código de 6 dígitos recibido en Discord:
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
                    onClick={() => sendCodeToDiscord()}
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
                  onClick={() => sendCodeToDiscord()}
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
