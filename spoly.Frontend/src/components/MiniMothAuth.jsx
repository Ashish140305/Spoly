import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const STORAGE_KEY = "spoly_minimoth_session";

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const request = async (path, payload) => {
  const isGet = payload === undefined;
  const response = await fetch(`${BACKEND_URL}/api/auth/${path}`, {
    method: isGet ? "GET" : "POST",
    headers: isGet ? undefined : { "Content-Type": "application/json" },
    body: isGet ? undefined : JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body.detail;
    const message = typeof detail === "string" ? detail : detail?.message;
    const code = typeof detail === "object" ? detail?.code : null;
    throw new Error(code ? `${message || "Authentication request failed"} (${code})` : message || "Authentication request failed");
  }
  return body;
};

const AuthDialog = () => {
  const { authOpen, closeAuth, completeSignIn } = useAuth();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState("");

  if (!authOpen) return null;

  const sendCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setDelivery("");
    try {
      const result = await request("send-otp", { phone });
      setStep("code");
      if (result.otp_id) {
        setDelivery("OTP requested. Checking WhatsApp/SMS delivery…");
        const startedAt = Date.now();
        while (Date.now() - startedAt < 12000) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          try {
            const status = await request(`otp-status/${encodeURIComponent(result.otp_id)}`);
            if (status.status === "delivered") {
              setDelivery(`Code delivered via ${status.channel || "MiniMoth"}.`);
              break;
            }
            if (status.status === "failed") {
              setDelivery("MiniMoth reports delivery failed. Check the project’s delivery status in its dashboard.");
              break;
            }
            setDelivery(`OTP status: ${status.status || "queued"}${status.channel ? ` via ${status.channel}` : ""}…`);
          } catch (statusError) {
            setDelivery(statusError.message);
            break;
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await request("verify-otp", { phone, code });
      completeSignIn({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        expiresAt: result.expires_at,
        user: {
          id: result.identity_id || `phone:${phone}`,
          firstName: phone,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    setError("");
    setCode("");
    setStep("phone");
    closeAuth();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm" onMouseDown={close}>
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={close} className="float-right text-slate-400 hover:text-slate-700" aria-label="Close sign in">×</button>
        <div className="mb-6 pr-8">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Welcome to Spoly</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{step === "phone" ? "Sign in with your phone" : "Enter your verification code"}</h2>
          <p className="mt-2 text-sm text-slate-500">{step === "phone" ? "We’ll send a one-time code by WhatsApp or SMS." : "Enter the six-digit code sent to your phone."}</p>
        </div>
        {step === "phone" ? (
          <form onSubmit={sendCode} className="space-y-4">
            <input autoFocus required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {delivery && <p className="text-sm text-slate-600" role="status">{delivery}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{busy ? "Sending…" : "Send code"}</button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <input autoFocus required inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="6-digit code" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.45em] text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">{busy ? "Verifying…" : "Verify and continue"}</button>
            <button type="button" onClick={() => { setStep("phone"); setCode(""); setError(""); }} className="w-full text-sm font-semibold text-indigo-600">Use a different number</button>
          </form>
        )}
      </div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);

  const value = useMemo(() => ({
    user: session?.user || null,
    isSignedIn: Boolean(session?.accessToken),
    isLoaded: true,
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    completeSignIn: (nextSession) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setAuthOpen(false);
    },
    signOut: async () => {
      const refreshToken = session?.refreshToken;
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      if (refreshToken) request("logout", { refresh_token: refreshToken }).catch(() => {});
    },
  }), [session, authOpen]);

  return <AuthContext.Provider value={value}>{children}<AuthDialog /></AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export const useUser = () => {
  const { user, isLoaded } = useAuth();
  return { user, isLoaded };
};

export const SignedIn = ({ children }) => useAuth().isSignedIn ? children : null;
export const SignedOut = ({ children }) => !useAuth().isSignedIn ? children : null;

const AuthButton = ({ children }) => {
  const { openAuth } = useAuth();
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (event) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) openAuth();
    },
  });
};

export const SignInButton = AuthButton;
export const SignUpButton = AuthButton;

export const UserButton = ({ afterSignOutUrl = "/", appearance }) => {
  const { user, signOut } = useAuth();
  const initials = (user?.firstName || "U").replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "U";
  return <button type="button" title="Sign out" onClick={async () => { await signOut(); window.location.assign(afterSignOutUrl); }} className={appearance?.elements?.avatarBox || "w-10 h-10 rounded-full"}><span className="flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{initials}</span></button>;
};
