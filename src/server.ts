import "./lib/error-capture";
import nodemailer from "nodemailer";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

async function handleContactRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Metoda nije dozvoljena." }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Telo zahteva mora biti JSON." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Neispravan format podataka." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const data = body as Record<string, unknown>;
  const ime = String(data.ime ?? "").trim();
  const prezime = String(data.prezime ?? "").trim();
  const email = String(data.email ?? "").trim();
  const telefon = String(data.telefon ?? "").trim();
  const poruka = String(data.poruka ?? "").trim();

  if (!ime || !prezime || !email || !poruka) {
    return new Response(JSON.stringify({ error: "Popunite sva obavezna polja." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const recipient = process.env.CONTACT_EMAIL ?? "lumavitaballoons@gmail.com";

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return new Response(JSON.stringify({ error: "SMTP konfiguracija nije postavljena na serveru." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `LumaVita upit od ${ime} ${prezime}`;
  const text = `Ime: ${ime}\nPrezime: ${prezime}\nEmail: ${email}\nTelefon: ${telefon}\n\nPoruka:\n${poruka}`;
  const html = `
    <p><strong>Ime:</strong> ${ime}</p>
    <p><strong>Prezime:</strong> ${prezime}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefon:</strong> ${telefon}</p>
    <hr />
    <p><strong>Poruka:</strong></p>
    <p>${poruka.replace(/\n/g, "<br />")}</p>
  `;

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: recipient,
      replyTo: email,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Contact email failed", error);
    return new Response(JSON.stringify({ error: "Greška pri slanju mejla." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/contact") {
        return await handleContactRequest(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};