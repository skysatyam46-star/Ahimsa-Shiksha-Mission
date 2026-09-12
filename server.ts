import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import ImageKit from "imagekit";
import { createServer as createViteServer } from "vite";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Ensure local uploads directory exists for image uploads fallback
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to initialize ImageKit SDK securely using environment variables
function getImageKitInstance() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    const missing: string[] = [];
    if (!publicKey) missing.push("IMAGEKIT_PUBLIC_KEY");
    if (!privateKey) missing.push("IMAGEKIT_PRIVATE_KEY");
    if (!urlEndpoint) missing.push("IMAGEKIT_URL_ENDPOINT");
    return { ik: null, missing };
  }

  const ik = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
  return { ik, missing: [] };
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" })); // Support large CMS payloads if necessary
app.use("/uploads", express.static(uploadsDir));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Initialize firebase-admin
const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "ahimsa-shiksha-mission";

if (getApps().length === 0) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountKey) {
      console.log("[Server] Initializing Firebase Admin with custom Service Account credential...");
      const credentialData = JSON.parse(serviceAccountKey);
      initializeApp({
        credential: cert(credentialData),
        projectId: projectId
      });
    } else {
      console.log("[Server] Initializing Firebase Admin with Default Application Credentials for Project:", projectId);
      initializeApp({
        projectId: projectId
      });
    }
    console.log("[Server] Firebase Admin initialized successfully.");
  } catch (initErr) {
    console.error("[Server] Firebase Admin initialization failed:", initErr);
  }
}

// Support custom Firestore Database ID (especially useful if configured in environment as 'default' or a custom database ID)
const databaseId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || process.env.FIREBASE_FIRESTORE_DATABASE_ID || "(default)";
console.log("[Server] Firestore Database ID from Env:", databaseId);

let adminDb: any;
try {
  if (databaseId && databaseId !== "(default)" && databaseId !== "default") {
    adminDb = getFirestore(databaseId);
  } else {
    adminDb = getFirestore();
  }
  console.log("[Server] Firestore Admin initialized successfully.");
} catch (dbErr) {
  console.error("[Server] Firestore Admin initialization failed:", dbErr);
  adminDb = getFirestore(); // fallback to default
}

// Active Admin Sessions (In-Memory Set + Persistent Signed Token)
const activeSessions = new Set<string>();

function getAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "ahimsa_mission_secret_salt_2026";
  return crypto.createHmac("sha256", secret).update("ahimsa_admin_authenticated_session").digest("hex");
}

function isValidAdminSession(session?: string): boolean {
  if (!session || typeof session !== "string") return false;
  const trimmed = session.trim();
  if (!trimmed) return false;
  return trimmed === getAdminToken() || activeSessions.has(trimmed);
}

// Login Rate-Limiting Store (In-Memory Map)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

// Helper to parse cookies from headers
function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach(cookie => {
    const parts = cookie.split("=");
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  return cookies;
}

// Extract admin authentication token from request (header or cookie)
function extractAdminToken(req: express.Request): string | undefined {
  // 1. Check custom header x-admin-token
  const xToken = req.headers["x-admin-token"];
  if (typeof xToken === "string" && xToken.trim()) {
    return xToken.trim();
  }
  // 2. Check Authorization Bearer header
  const authHeader = req.headers["authorization"];
  if (typeof authHeader === "string") {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  // 3. Check cookies
  const cookies = parseCookies(req.headers.cookie);
  if (cookies["admin_session"]) {
    return cookies["admin_session"].trim();
  }
  return undefined;
}

// Authentication Middleware to Guard Admin Endpoints
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = extractAdminToken(req);
  
  if (isValidAdminSession(token)) {
    return next();
  }
  
  console.warn(`[ServerAuth] Blocked unauthorized attempt to path: ${req.path}`);
  return res.status(401).json({ success: false, error: "Access Denied. Unauthorized session." });
}

/* ---------------- AUTHENTICATION APIS ---------------- */

// 1. Session Verification
app.get("/api/admin/check-session", (req, res) => {
  const token = extractAdminToken(req);
  const isValid = isValidAdminSession(token);
  
  return res.json({ 
    success: true, 
    isAdmin: isValid,
    token: isValid ? token : undefined,
    profile: isValid ? {
      role: "admin",
      active: true,
      email: "admin@ahimsa.org",
      name: "Ahimsa Admin"
    } : null
  });
});

// 2. Admin Login API with brute-force rate-limiting
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  
  // Rate-limiting and lock checks
  const ip = req.ip || req.headers["x-forwarded-for"] || "";
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  
  const record = loginAttempts.get(ipStr);
  if (record && record.lockUntil > Date.now()) {
    return res.status(429).json({ 
      success: false, 
      error: "Too many failed attempts. Please try again later (15m lockout)." 
    });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error("[ServerAuth] ADMIN_PASSWORD secret is NOT configured in environment!");
    return res.status(500).json({ success: false, error: "Authentication system is not configured." });
  }

  if (password === expectedPassword) {
    // Clear failed login records
    loginAttempts.delete(ipStr);

    // Generate secure persistent signed session ID
    const sessionId = getAdminToken();
    activeSessions.add(sessionId);

    // Set cookie supporting modern iframe/embedded preview (SameSite=None; Secure)
    res.setHeader(
      "Set-Cookie", 
      `admin_session=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=2592000`
    );
    console.info(`[ServerAuth] Successful Admin Login from IP: ${ipStr}`);
    return res.json({ 
      success: true, 
      isAdmin: true, 
      token: sessionId,
      profile: {
        role: "admin",
        active: true,
        email: "admin@ahimsa.org",
        name: "Ahimsa Admin"
      }
    });
  } else {
    // Fail: Increment rate-limiting count
    const count = (record?.count || 0) + 1;
    if (count >= 5) {
      console.warn(`[ServerAuth] Lockout triggered for IP: ${ipStr} due to 5 failed attempts.`);
      loginAttempts.set(ipStr, { count, lockUntil: Date.now() + 15 * 60 * 1000 });
    } else {
      loginAttempts.set(ipStr, { count, lockUntil: 0 });
    }

    return res.status(401).json({ success: false, error: "गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।" });
  }
});

// 3. Admin Logout API
app.post("/api/admin/logout", (req, res) => {
  const token = extractAdminToken(req);
  
  if (token) {
    activeSessions.delete(token);
  }

  // Clear cookie header
  res.setHeader(
    "Set-Cookie", 
    "admin_session=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0"
  );
  
  console.info("[ServerAuth] Admin session logged out successfully.");
  return res.json({ success: true });
});


/* ---------------- FIRESTORE PERSISTENCE APIS ---------------- */

// 4. Load Public Data from Firestore (Open to everyone, no-login required)
// Returns ONLY published content and published links
app.get("/api/get-public-data", async (req, res) => {
  try {
    console.info("[ServerCMS] Fetching public website CMS data from Firestore...");
    
    const contentDocs = await adminDb.collection("content").get();
    const linksDocs = await adminDb.collection("links").get();
    const settingsDocs = await adminDb.collection("settings").get();

    const vichar: any[] = [];
    const videos: any[] = [];
    const audio: any[] = [];
    const photos: any[] = [];
    const documents: any[] = [];
    const notices: any[] = [];

    contentDocs.forEach(doc => {
      const item = doc.data();
      // Public site MUST ONLY receive published content
      if (item.status === "published") {
        if (item.type === "vichar") vichar.push(item);
        else if (item.type === "video") videos.push(item);
        else if (item.type === "audio") audio.push(item);
        else if (item.type === "photo") photos.push(item);
        else if (item.type === "document") documents.push(item);
        else if (item.type === "notice") notices.push(item);
      }
    });

    // Sort content newest first
    const sortByDateDesc = (a: any, b: any) => {
      const timeA = new Date(a.publishedAt || a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    };

    vichar.sort(sortByDateDesc);
    videos.sort(sortByDateDesc);
    audio.sort(sortByDateDesc);
    photos.sort(sortByDateDesc);
    documents.sort(sortByDateDesc);
    notices.sort(sortByDateDesc);

    const links: any[] = [];
    let hasFacebook = false;
    linksDocs.forEach(doc => {
      const item = doc.data();
      if (item.title === "Facebook" || item.url === "https://www.facebook.com/share/1MRf7TAZsH/" || doc.id === "link-facebook") {
        hasFacebook = true;
      }
      if (item.status === "published") {
        links.push(item);
      }
    });

    if (!hasFacebook) {
      const fbItem = {
        id: "link-facebook",
        title: "Facebook",
        url: "https://www.facebook.com/share/1MRf7TAZsH/",
        description: "",
        status: "published",
        order: 1,
        category: "facebook",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      adminDb.collection("links").doc("link-facebook").set(fbItem).catch((err: any) => {
        console.error("[ServerCMS] Error seeding Facebook link in Firestore:", err);
      });
      links.push(fbItem);
    }

    // Ensure links are in order
    links.sort((a, b) => (a.order || 0) - (b.order || 0));

    let mission: any = null;
    let founder: any = null;
    let contact: any = null;
    let website: any = null;

    settingsDocs.forEach(doc => {
      if (doc.id === "mission") mission = doc.data();
      else if (doc.id === "founder") founder = doc.data();
      else if (doc.id === "contact") contact = doc.data();
      else if (doc.id === "website") website = doc.data();
    });

    const defaultFounderData = {
      name: "अमर लाल चौधरी",
      role: "संस्थापक • अहिंसा शिक्षा मिशन",
      nameEn: "Amar Lal Choudhari",
      roleEn: "Founder • Ahimsa Shiksha Mission",
      bio: "संस्थापक के बारे में संक्षिप्त परिचय यहाँ प्रदर्शित होगा।",
      message: "“अहिंसा और सत्य ही वह आधारशिला हैं जिस पर एक न्यायपूर्ण और दयालु समाज की रचना हो सकती है। हमारा संकल्प है कि शिक्षा हर हृदय में करुणा का दीप प्रज्वलित करे।”",
      updatedAt: new Date().toISOString()
    };

    if (!founder || !founder.name || founder.name === "संस्थापक का नाम" || founder.name.trim() === "") {
      founder = { ...defaultFounderData, ...(founder || {}) };
      if (!founder.name || founder.name === "संस्थापक का नाम" || founder.name.trim() === "") {
        founder.name = "अमर लाल चौधरी";
      }
      if (!founder.role || founder.role.trim() === "") {
        founder.role = "संस्थापक • अहिंसा शिक्षा मिशन";
      }
      adminDb.collection("settings").doc("founder").set(founder).catch((err: any) => {
        console.error("[ServerCMS] Error initializing founder doc in Firestore:", err);
      });
    }

    if (!contact || !contact.email || contact.email === "contact@ahimsashiksha.org" || contact.email.trim() === "" || contact.address !== "नरहट, सिवान, बिहार") {
      contact = {
        ...(contact || {}),
        email: "amarsiwan1975@gmail.com",
        phone: "",
        address: "नरहट, सिवान, बिहार",
        updatedAt: new Date().toISOString()
      };
      adminDb.collection("settings").doc("contact").set(contact).catch((err: any) => {
        console.error("[ServerCMS] Error initializing contact doc in Firestore:", err);
      });
    }

    const resultStore = {
      version: "2.0.0",
      vichar,
      videos,
      audio,
      photos,
      documents,
      notices,
      links,
      mission,
      founder,
      contact,
      website
    };

    return res.json(resultStore);
  } catch (error: any) {
    console.error("[ServerCMS] Error loading public CMS data from Firestore:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error loading CMS data" });
  }
});

// 5. Load All Admin Data from Firestore (Guarded - Admin session validation required)
// Returns ALL content including drafts
app.get("/api/admin/get-data", requireAdmin, async (req, res) => {
  try {
    console.info("[ServerCMS] Fetching full Admin CMS data from Firestore...");

    const contentDocs = await adminDb.collection("content").get();
    const linksDocs = await adminDb.collection("links").get();
    const settingsDocs = await adminDb.collection("settings").get();

    const vichar: any[] = [];
    const videos: any[] = [];
    const audio: any[] = [];
    const photos: any[] = [];
    const documents: any[] = [];
    const notices: any[] = [];

    contentDocs.forEach(doc => {
      const item = doc.data();
      if (item.type === "vichar") vichar.push(item);
      else if (item.type === "video") videos.push(item);
      else if (item.type === "audio") audio.push(item);
      else if (item.type === "photo") photos.push(item);
      else if (item.type === "document") documents.push(item);
      else if (item.type === "notice") notices.push(item);
    });

    // Sort content newest first
    const sortByDateDesc = (a: any, b: any) => {
      const timeA = new Date(a.publishedAt || a.createdAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    };

    vichar.sort(sortByDateDesc);
    videos.sort(sortByDateDesc);
    audio.sort(sortByDateDesc);
    photos.sort(sortByDateDesc);
    documents.sort(sortByDateDesc);
    notices.sort(sortByDateDesc);

    const links: any[] = [];
    let hasFacebookAdmin = false;
    linksDocs.forEach(doc => {
      const item = doc.data();
      if (item.title === "Facebook" || item.url === "https://www.facebook.com/share/1MRf7TAZsH/" || doc.id === "link-facebook") {
        hasFacebookAdmin = true;
      }
      links.push(item);
    });

    if (!hasFacebookAdmin) {
      const fbItem = {
        id: "link-facebook",
        title: "Facebook",
        url: "https://www.facebook.com/share/1MRf7TAZsH/",
        description: "",
        status: "published",
        order: 1,
        category: "facebook",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      adminDb.collection("links").doc("link-facebook").set(fbItem).catch((err: any) => {
        console.error("[ServerCMS] Error seeding Facebook link in Firestore:", err);
      });
      links.push(fbItem);
    }

    links.sort((a, b) => (a.order || 0) - (b.order || 0));

    let mission: any = null;
    let founder: any = null;
    let contact: any = null;
    let website: any = null;

    settingsDocs.forEach(doc => {
      if (doc.id === "mission") mission = doc.data();
      else if (doc.id === "founder") founder = doc.data();
      else if (doc.id === "contact") contact = doc.data();
      else if (doc.id === "website") website = doc.data();
    });

    if (!founder || !founder.name || founder.name === "संस्थापक का नाम" || founder.name.trim() === "") {
      founder = {
        name: "अमर लाल चौधरी",
        role: "संस्थापक • अहिंसा शिक्षा मिशन",
        nameEn: "Amar Lal Choudhari",
        roleEn: "Founder • Ahimsa Shiksha Mission",
        bio: "संस्थापक के बारे में संक्षिप्त परिचय यहाँ प्रदर्शित होगा।",
        message: "“अहिंसा और सत्य ही वह आधारशिला हैं जिस पर एक न्यायपूर्ण और दयालु समाज की रचना हो सकती है। हमारा संकल्प है कि शिक्षा हर हृदय में करुणा का दीप प्रज्वलित करे।”",
        updatedAt: new Date().toISOString(),
        ...(founder || {})
      };
    }

    if (!contact || !contact.email || contact.email === "contact@ahimsashiksha.org" || contact.email.trim() === "" || contact.address !== "नरहट, सिवान, बिहार") {
      contact = {
        ...(contact || {}),
        email: "amarsiwan1975@gmail.com",
        phone: "",
        address: "नरहट, सिवान, बिहार",
        updatedAt: new Date().toISOString()
      };
    }

    const resultStore = {
      version: "2.0.0",
      vichar,
      videos,
      audio,
      photos,
      documents,
      notices,
      links,
      mission,
      founder,
      contact,
      website
    };

    return res.json({ success: true, data: resultStore });
  } catch (error: any) {
    console.error("[ServerCMS] Error loading Admin CMS data from Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to load Admin CMS data." });
  }
});

// 5b. Bulk Save Data Endpoint (Guarded - Admin session validation required)
app.post("/api/admin/save-data", requireAdmin, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Invalid data payload" });
    }

    const batch = adminDb.batch();

    // Content items
    const allItems = [
      ...(Array.isArray(payload.vichar) ? payload.vichar : []),
      ...(Array.isArray(payload.videos) ? payload.videos : []),
      ...(Array.isArray(payload.audio) ? payload.audio : []),
      ...(Array.isArray(payload.photos) ? payload.photos : []),
      ...(Array.isArray(payload.documents) ? payload.documents : []),
      ...(Array.isArray(payload.notices) ? payload.notices : []),
    ];

    for (const item of allItems) {
      if (item && item.id) {
        const ref = adminDb.collection("content").doc(item.id);
        batch.set(ref, item);
      }
    }

    // Links
    if (Array.isArray(payload.links)) {
      for (const link of payload.links) {
        if (link && link.id) {
          const ref = adminDb.collection("links").doc(link.id);
          batch.set(ref, link);
        }
      }
    }

    // Settings
    if (payload.mission) {
      batch.set(adminDb.collection("settings").doc("mission"), payload.mission);
    }
    if (payload.founder) {
      batch.set(adminDb.collection("settings").doc("founder"), payload.founder);
    }
    if (payload.contact) {
      batch.set(adminDb.collection("settings").doc("contact"), payload.contact);
    }

    await batch.commit();
    console.info("[ServerCMS] Successfully saved bulk data to Firestore.");
    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error saving bulk data to Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to bulk save data to Firestore." });
  }
});

// 6. Save/Update Single Content Document (Guarded - Admin session validation required)
app.post("/api/admin/content", requireAdmin, async (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id || !item.type) {
      return res.status(400).json({ success: false, error: "Invalid content item payload" });
    }

    const nowIso = new Date().toISOString();
    item.updatedAt = nowIso;
    item.createdAt = item.createdAt || nowIso;

    if (item.status === "published") {
      if (!item.publishedAt) {
        item.publishedAt = nowIso;
      }
    } else if (item.status === "draft") {
      delete item.publishedAt;
    }

    console.info(`[ServerCMS] Upserting content document (${item.type}/${item.id}) to Firestore...`);
    await adminDb.collection("content").doc(item.id).set(item);

    return res.json({ success: true, item });
  } catch (error: any) {
    console.error("[ServerCMS] Error saving content to Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to save content to Firestore." });
  }
});

// 7. Delete Single Content Document (Guarded - Admin session validation required)
app.delete("/api/admin/content/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: "Missing document ID" });
    }

    const docRef = adminDb.collection("content").doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const fileIdToDelete = data?.imageFileId || data?.thumbnailFileId;
      if (fileIdToDelete) {
        if (typeof fileIdToDelete === "string" && fileIdToDelete.startsWith("local_")) {
          if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            for (const f of files) {
              if (f.startsWith(fileIdToDelete)) {
                try {
                  fs.unlinkSync(path.join(uploadsDir, f));
                  console.info(`[LocalUpload] Cleaned up local file (${f}) for deleted content (${id})`);
                } catch (e) {
                  console.error(`[LocalUpload] Failed to delete local file (${f}):`, e);
                }
                break;
              }
            }
          }
        } else {
          const { ik } = getImageKitInstance();
          if (ik) {
            try {
              await ik.deleteFile(fileIdToDelete);
              console.info(`[ImageKit] Cleaned up associated fileId (${fileIdToDelete}) for deleted content (${id})`);
            } catch (ikErr) {
              console.error(`[ImageKit] Failed to delete associated fileId (${fileIdToDelete}):`, ikErr);
            }
          }
        }
      }
    }

    console.info(`[ServerCMS] Deleting content document (${id}) from Firestore...`);
    await docRef.delete();

    // Clean up related likes from Firestore
    try {
      const likesSnapshot = await adminDb.collection("likes").where("contentId", "==", id).get();
      if (!likesSnapshot.empty) {
        const batch = adminDb.batch();
        likesSnapshot.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.info(`[ServerCMS] Deleted associated likes for content (${id})`);
      }
    } catch (likeCleanErr) {
      console.error(`[ServerCMS] Failed to delete associated likes for (${id}):`, likeCleanErr);
    }

    // Clean up related notifications from Firestore
    try {
      const notifsSnapshot = await adminDb.collection("notifications").where("contentId", "==", id).get();
      if (!notifsSnapshot.empty) {
        const batch = adminDb.batch();
        notifsSnapshot.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.info(`[ServerCMS] Deleted associated notifications for content (${id})`);
      }
    } catch (notifCleanErr) {
      console.error(`[ServerCMS] Failed to delete associated notifications for (${id}):`, notifCleanErr);
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error deleting content from Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to delete content from Firestore." });
  }
});

// 7b. Upload Image (Strictly Enforces ImageKit CDN for Photos with validation)
app.post("/api/admin/upload-image", requireAdmin, async (req, res) => {
  try {
    const { file, fileName } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, error: "No image file provided for upload." });
    }

    // 1. Validate that the uploaded file is an image and check file size / MIME types
    if (typeof file === "string" && file.startsWith("data:")) {
      const match = file.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ success: false, error: "अमान्य फ़ाइल फॉर्मेट।" });
      }

      const mimeType = match[1];
      const base64Data = match[2];

      // Validate MIME type is an image
      if (!mimeType.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          error: `केवल इमेज फ़ाइलें (JPEG, PNG, WebP, GIF) अपलोड करने की अनुमति है। मिला: ${mimeType}`
        });
      }

      // Check file size (Base64 size limit ~10MB)
      const approxSizeBytes = (base64Data.length * 3) / 4;
      const maxSizeBytes = 10 * 1024 * 1024; // 10MB
      if (approxSizeBytes > maxSizeBytes) {
        return res.status(400).json({
          success: false,
          error: "चुनी गई इमेज बहुत बड़ी है। अधिकतम सीमा 10MB है।"
        });
      }
    } else if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
      // Already uploaded / remote URL, return as is
      return res.json({
        success: true,
        url: file,
        fileId: `url_${Date.now()}`,
      });
    } else {
      // Raw string or unsupported format
      return res.status(400).json({
        success: false,
        error: "कृपया इमेज को मान्य Base64 डेटा यूआरएल फॉर्मेट में भेजें।"
      });
    }

    // 2. Initialize ImageKit
    const { ik, missing } = getImageKitInstance();
    if (!ik || missing.length > 0) {
      return res.status(500).json({
        success: false,
        error: `इमेज किट सर्वर पर कॉन्फ़िगर नहीं है। कृपया ये पर्यावरण चर दर्ज करें: ${missing.join(", ")}`
      });
    }

    console.info("[ImageKit] Uploading image file to ImageKit...");
    const uploadRes = await ik.upload({
      file,
      fileName: fileName || `ahimsa_photo_${Date.now()}.jpg`,
      folder: "/ahimsa_photos",
    });

    console.info(`[ImageKit] Upload succeeded! URL: ${uploadRes.url}, fileId: ${uploadRes.fileId}`);
    return res.json({
      success: true,
      url: uploadRes.url,
      fileId: uploadRes.fileId,
    });
  } catch (err: any) {
    console.error("[Upload] Strict ImageKit upload failed:", err);
    return res.status(500).json({
      success: false,
      error: `इमेज किट अपलोड विफल: ${err?.message || "सर्वर त्रुटि"}`,
    });
  }
});

// 7bb. Upload File (Supports Audios, PDFs/Documents, and Images - ImageKit with local server storage fallback)
app.post("/api/admin/upload-file", requireAdmin, async (req, res) => {
  try {
    const { file, fileName, type } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, error: "No file content provided for upload." });
    }

    // 1. If it's already an HTTP/HTTPS url, return as is
    if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
      return res.json({
        success: true,
        url: file,
        fileId: `url_${Date.now()}`,
      });
    }

    if (typeof file !== "string" || !file.startsWith("data:")) {
      return res.status(400).json({
        success: false,
        error: "कृपया फ़ाइल को मान्य Base64 डेटा यूआरएल फॉर्मेट में भेजें।"
      });
    }

    const match = file.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ success: false, error: "अमान्य फ़ाइल फॉर्मेट।" });
    }

    const mimeType = match[1];
    const base64Data = match[2];

    // Check file size (Base64 size limit ~30MB)
    const approxSizeBytes = (base64Data.length * 3) / 4;
    const maxSizeBytes = 30 * 1024 * 1024; // 30MB limit for general file uploads
    if (approxSizeBytes > maxSizeBytes) {
      return res.status(400).json({
        success: false,
        error: "चुनी गई फ़ाइल बहुत बड़ी है। अधिकतम सीमा 30MB है।"
      });
    }

    // 2. Try ImageKit upload first if configured
    const { ik, missing } = getImageKitInstance();
    if (ik && missing.length === 0) {
      try {
        console.info(`[ImageKit] Uploading file (${fileName || 'file'}) to ImageKit...`);
        const uploadRes = await ik.upload({
          file,
          fileName: fileName || `ahimsa_file_${Date.now()}`,
          folder: type === "audio" ? "/ahimsa_audios" : type === "document" ? "/ahimsa_docs" : "/ahimsa_general",
        });

        console.info(`[ImageKit] Upload succeeded! URL: ${uploadRes.url}, fileId: ${uploadRes.fileId}`);
        return res.json({
          success: true,
          url: uploadRes.url,
          fileId: uploadRes.fileId,
        });
      } catch (ikErr: any) {
        console.warn("[ImageKit] Upload failed, falling back to local storage:", ikErr);
      }
    } else {
      console.info("[ImageKit] Not configured, using local storage fallback.");
    }

    // 3. Fall back to local file storage inside public/uploads
    try {
      const buffer = Buffer.from(base64Data, "base64");
      const ext = mimeType.split("/")[1] || "bin";
      const safeExt = fileName ? path.extname(fileName) : `.${ext}`;
      const uniqueId = `local_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const localFileName = `${uniqueId}${safeExt}`;
      const filePath = path.join(uploadsDir, localFileName);

      fs.writeFileSync(filePath, buffer);
      console.info(`[LocalUpload] Successfully saved local file to ${filePath}`);

      return res.json({
        success: true,
        url: `/uploads/${localFileName}`,
        fileId: uniqueId,
      });
    } catch (localErr: any) {
      console.error("[LocalUpload] Saving local file failed:", localErr);
      return res.status(500).json({
        success: false,
        error: `फ़ाइल सहेजने में विफल: ${localErr?.message || "स्थानीय सर्वर त्रुटि"}`,
      });
    }
  } catch (err: any) {
    console.error("[UploadFile] General upload failed:", err);
    return res.status(500).json({
      success: false,
      error: `अपलोड विफल: ${err?.message || "सर्वर त्रुटि"}`,
    });
  }
});

// 7c. Delete Image (Supports ImageKit CDN or Local Server Storage Fallback)
app.post("/api/admin/delete-image", requireAdmin, async (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ success: false, error: "Missing fileId parameter." });
    }

    if (typeof fileId === "string" && fileId.startsWith("local_")) {
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
          if (file.startsWith(fileId)) {
            try {
              fs.unlinkSync(path.join(uploadsDir, file));
              console.info(`[LocalUpload] Deleted local file ${file}`);
            } catch (e) {
              console.error(`[LocalUpload] Error unlinking ${file}:`, e);
            }
            break;
          }
        }
      }
      return res.json({ success: true });
    }

    const { ik, missing } = getImageKitInstance();
    if (ik && missing.length === 0) {
      console.info(`[ImageKit] Deleting fileId ${fileId} from ImageKit...`);
      await ik.deleteFile(fileId);
      console.info(`[ImageKit] FileId ${fileId} successfully deleted from ImageKit.`);
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("[Upload] Delete fileId error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Failed to delete image asset",
    });
  }
});

// 8. Save/Update Single Link Document (Guarded - Admin session validation required)
app.post("/api/admin/links", requireAdmin, async (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ success: false, error: "Invalid link item payload" });
    }

    const nowIso = new Date().toISOString();
    item.updatedAt = nowIso;
    item.createdAt = item.createdAt || nowIso;

    console.info(`[ServerCMS] Upserting link document (${item.id}) to Firestore...`);
    await adminDb.collection("links").doc(item.id).set(item);

    return res.json({ success: true, item });
  } catch (error: any) {
    console.error("[ServerCMS] Error saving link to Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to save link to Firestore." });
  }
});

// 9. Delete Single Link Document (Guarded - Admin session validation required)
app.delete("/api/admin/links/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: "Missing link ID" });
    }

    console.info(`[ServerCMS] Deleting link document (${id}) from Firestore...`);
    await adminDb.collection("links").doc(id).delete();

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error deleting link from Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to delete link from Firestore." });
  }
});

// 10. Save/Update Settings Document (Guarded - Admin session validation required)
app.post("/api/admin/settings/:docId", requireAdmin, async (req, res) => {
  try {
    const { docId } = req.params;
    const payload = req.body;
    if (!docId || !["mission", "founder", "contact", "website"].includes(docId)) {
      return res.status(400).json({ success: false, error: "Invalid settings document ID" });
    }

    const nowIso = new Date().toISOString();
    payload.updatedAt = nowIso;

    console.info(`[ServerCMS] Updating settings document (${docId}) in Firestore...`);
    await adminDb.collection("settings").doc(docId).set(payload);

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error updating settings in Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to update settings in Firestore." });
  }
});

// 11. Full CMS Store Synchronization (Guarded - Admin session validation required)
app.post("/api/admin/save-data", requireAdmin, async (req, res) => {
  try {
    const incomingStore = req.body;
    if (!incomingStore) {
      return res.status(400).json({ success: false, error: "Missing body data" });
    }

    console.info("[ServerCMS] Synchronizing full CMS store to Firestore...");

    // A. Sync Content
    const contentRef = adminDb.collection("content");
    const existingContentDocs = await contentRef.get();
    
    // Gather incoming content items
    const allIncomingContentItems = [
      ...(incomingStore.vichar || []),
      ...(incomingStore.videos || []),
      ...(incomingStore.audio || []),
      ...(incomingStore.photos || []),
      ...(incomingStore.documents || []),
      ...(incomingStore.notices || [])
    ];
    
    const incomingContentIds = new Set(allIncomingContentItems.map((item: any) => item.id).filter(Boolean));

    // Delete existing documents not present in the incoming set
    for (const doc of existingContentDocs.docs) {
      if (!incomingContentIds.has(doc.id)) {
        await doc.ref.delete();
      }
    }

    // Upsert incoming items
    for (const item of allIncomingContentItems) {
      if (item.id) {
        await contentRef.doc(item.id).set(item);
      }
    }

    // B. Sync Links
    const linksRef = adminDb.collection("links");
    const existingLinksDocs = await linksRef.get();
    const incomingLinkIds = new Set((incomingStore.links || []).map((item: any) => item.id).filter(Boolean));

    for (const doc of existingLinksDocs.docs) {
      if (!incomingLinkIds.has(doc.id)) {
        await doc.ref.delete();
      }
    }

    for (const item of (incomingStore.links || [])) {
      if (item.id) {
        await linksRef.doc(item.id).set(item);
      }
    }

    // C. Sync Settings
    const settingsRef = adminDb.collection("settings");
    if (incomingStore.mission) {
      await settingsRef.doc("mission").set(incomingStore.mission);
    }
    if (incomingStore.founder) {
      await settingsRef.doc("founder").set(incomingStore.founder);
    }
    if (incomingStore.contact) {
      await settingsRef.doc("contact").set(incomingStore.contact);
    }
    if (incomingStore.website) {
      await settingsRef.doc("website").set(incomingStore.website);
    }

    console.info("[ServerCMS] Firestore synchronization completed successfully.");
    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error synchronizing CMS data to Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to persist CMS changes to Firestore." });
  }
});

/* ---------------- LIKES & NOTIFICATIONS APIS ---------------- */

// Simple in-memory rate limiting map for like operations
const likeRateLimitMap = new Map<string, number[]>();

function checkLikeRateLimit(deviceId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // max 30 like operations per minute per device

  const timestamps = (likeRateLimitMap.get(deviceId) || []).filter(ts => now - ts < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  likeRateLimitMap.set(deviceId, timestamps);
  return true;
}

// 1. Public Like / Unlike Endpoint
app.post("/api/public/like", async (req, res) => {
  try {
    const { contentId, contentType, contentTitle, action, deviceId } = req.body || {};

    if (!contentId || typeof contentId !== "string" || !deviceId || typeof deviceId !== "string") {
      return res.status(400).json({ success: false, error: "invalid_params" });
    }

    const validTypes = ["vichar", "video", "audio", "photo", "document", "notice"];
    if (contentType && !validTypes.includes(contentType)) {
      return res.status(400).json({ success: false, error: "invalid_content_type" });
    }

    if (!checkLikeRateLimit(deviceId)) {
      return res.status(429).json({ success: false, error: "too_many_requests" });
    }

    const contentRef = adminDb.collection("content").doc(contentId);
    const contentDoc = await contentRef.get();

    if (!contentDoc.exists) {
      return res.status(404).json({ success: false, error: "content_not_found" });
    }

    const contentData = contentDoc.data() || {};
    const currentLikes = typeof contentData.likesCount === "number" ? contentData.likesCount : 0;

    const sanitizedDeviceId = deviceId.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 64) || "anon";
    const likeDocId = `${contentId}_${sanitizedDeviceId}`;
    const likeRef = adminDb.collection("likes").doc(likeDocId);
    const likeDoc = await likeRef.get();

    let newLikesCount = currentLikes;
    let isLiked = false;

    if (action === "like") {
      if (!likeDoc.exists) {
        // Create like document
        await likeRef.set({
          contentId,
          contentType: contentType || contentData.type || "vichar",
          deviceId,
          createdAt: new Date().toISOString()
        });

        // Increment likes count on content document
        newLikesCount = currentLikes + 1;
        await contentRef.update({
          likesCount: newLikesCount,
          updatedAt: new Date().toISOString()
        });

        // Create Admin Notification document in Firestore
        const notifRef = adminDb.collection("notifications").doc();
        await notifRef.set({
          id: notifRef.id,
          type: "like",
          event: "👍 पसंद मिला",
          contentType: contentType || contentData.type || "vichar",
          contentId: contentId,
          contentTitle: contentTitle || contentData.title || contentData.leadParagraph || "अनाम सामग्री",
          totalLikes: newLikesCount,
          createdAt: new Date().toISOString(),
          read: false
        });
      }
      isLiked = true;
    } else if (action === "unlike") {
      if (likeDoc.exists) {
        // Delete like document
        await likeRef.delete();

        // Decrement likes count
        newLikesCount = Math.max(0, currentLikes - 1);
        await contentRef.update({
          likesCount: newLikesCount,
          updatedAt: new Date().toISOString()
        });
      }
      isLiked = false;
    } else {
      return res.status(400).json({ success: false, error: "invalid_action" });
    }

    return res.json({
      success: true,
      contentId,
      likesCount: newLikesCount,
      isLiked
    });
  } catch (error: any) {
    console.error("[ServerCMS] Error processing like action:", error);
    return res.status(500).json({ success: false, error: "server_error" });
  }
});

// 2. Query Liked Item IDs for a device
app.get("/api/public/liked-ids", async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    if (!deviceId || typeof deviceId !== "string") {
      return res.json({ success: true, likedIds: [] });
    }

    const snapshot = await adminDb
      .collection("likes")
      .where("deviceId", "==", deviceId)
      .get();

    const likedIds: string[] = [];
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data && data.contentId) {
        likedIds.push(data.contentId);
      }
    });

    return res.json({ success: true, likedIds });
  } catch (error: any) {
    console.error("[ServerCMS] Error fetching liked IDs for device:", error);
    return res.json({ success: true, likedIds: [] });
  }
});

// 3. Admin Notifications API - Get Latest Notifications
app.get("/api/admin/notifications", requireAdmin, async (req, res) => {
  try {
    const snapshot = await adminDb
      .collection("notifications")
      .get();

    const notifications: any[] = [];
    let unreadCount = 0;

    snapshot.forEach((doc: any) => {
      const data = doc.data();
      notifications.push(data);
      if (!data.read) {
        unreadCount++;
      }
    });

    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({
      success: true,
      notifications: notifications.slice(0, 50),
      unreadCount
    });
  } catch (error: any) {
    console.error("[ServerCMS] Error fetching admin notifications:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch notifications." });
  }
});

// 4. Admin Notifications API - Mark as Read
app.post("/api/admin/notifications/mark-read", requireAdmin, async (req, res) => {
  try {
    const { notificationId, markAll } = req.body || {};

    if (markAll) {
      const snapshot = await adminDb
        .collection("notifications")
        .where("read", "==", false)
        .get();

      const batch = adminDb.batch();
      snapshot.forEach((doc: any) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } else if (notificationId) {
      await adminDb
        .collection("notifications")
        .doc(notificationId)
        .update({ read: true });
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error marking notifications read:", error);
    return res.status(500).json({ success: false, error: "Failed to update notification status." });
  }
});

/* ---------------- VOICE-TO-TEXT AUDIO TRANSCRIPTION API ---------------- */

let geminiAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing or empty.");
    }
    geminiAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiAiClient;
}

// Server-side audio transcription powered by Gemini
app.post("/api/admin/transcribe-audio", requireAdmin, async (req, res) => {
  try {
    const { audio, language = "hi" } = req.body || {};

    if (!audio || typeof audio !== "string") {
      return res.status(400).json({ success: false, error: "ऑडियो डेटा उपलब्ध नहीं है।" });
    }

    // Extract Base64 and MIME type
    let mimeType = "audio/webm";
    let base64Data = audio;

    if (audio.startsWith("data:")) {
      const match = audio.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        // Strip codec details for Gemini inlineData e.g. audio/webm;codecs=opus -> audio/webm
        mimeType = match[1].split(";")[0].trim();
        base64Data = match[2];
      }
    }

    if (!base64Data || base64Data.length < 50) {
      return res.json({ success: true, text: "" });
    }

    // Normalize standard audio mime types if needed
    if (mimeType.includes("webm")) mimeType = "audio/webm";
    else if (mimeType.includes("ogg") || mimeType.includes("opus")) mimeType = "audio/ogg";
    else if (mimeType.includes("mp4") || mimeType.includes("m4a")) mimeType = "audio/mp4";
    else if (mimeType.includes("wav")) mimeType = "audio/wav";
    else if (mimeType.includes("aac")) mimeType = "audio/aac";

    const ai = getGeminiClient();

    const promptText =
      language === "en"
        ? "Transcribe this spoken English audio exactly and cleanly. Return ONLY the transcribed words. Do not add quotes, markdown formatting, explanations, or commentary. If the audio is silence or unintelligible noise, return absolutely nothing."
        : "इस बोले गए हिंदी ऑडियो को अत्यधिक सटीकता से शुद्ध देवनागरी हिंदी में ट्रांसक्राइब (प्रतिलेखन) करें। केवल बोले गए शब्द ही वापस करें। कोई उद्धरण चिह्न (quotes), मार्कडाउन या अतिरिक्त टिप्पणी न जोड़ें। यदि ऑडियो में कोई स्पष्ट आवाज या शब्द न हो, तो केवल खाली स्ट्रिंग लौटाएं।";

    // Attempt transcription with primary transcription model gemini-2.5-flash / gemini-3.5-transcribe
    let transcriptText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        ],
      });

      transcriptText = response?.text || "";
    } catch (primaryErr: any) {
      console.warn("[Transcribe] Primary model failed, trying fallback...", primaryErr?.message);
      // Fallback to gemini-2.5-flash / gemini-1.5-flash or flash-lite if needed
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        ],
      });
      transcriptText = fallbackResponse?.text || "";
    }

    // Clean transcription
    let cleaned = transcriptText.trim();
    // Remove accidental backticks or quotes wrapping the text
    cleaned = cleaned.replace(/^["'`]+|["'`]+$/g, "").trim();

    return res.json({
      success: true,
      text: cleaned,
    });
  } catch (error: any) {
    console.error("[Transcribe] Audio transcription error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "आवाज प्रतिलेखन में त्रुटि हुई।",
    });
  }
});

// Admin Language Translation API (Hindi <-> English)
app.post("/api/admin/translate", requireAdmin, async (req, res) => {
  try {
    const { text, targetLang = "en" } = req.body || {};

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ success: false, error: "कृपया अनुवाद के लिए सामग्री प्रदान करें।" });
    }

    const ai = getGeminiClient();

    const promptText =
      targetLang === "en"
        ? `Translate the following Hindi text accurately and gracefully into English. Preserve paragraph breaks. Output ONLY the translated English text, without markdown formatting or introductory notes:\n\n${text}`
        : `इस अंग्रेजी सामग्री का शुद्ध, सरल और अर्थपूर्ण देवनागरी हिंदी में अनुवाद करें। पैराग्राफ संरचना बनाए रखें। केवल अनुवादित हिंदी पाठ ही आउटपुट करें, कोई अतिरिक्त टिप्पणी न दें:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
    });

    const translatedText = (response?.text || "").trim();

    return res.json({
      success: true,
      translatedText,
    });
  } catch (error: any) {
    console.error("[Translate] Translation error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "अनुवाद करने में विफलता हुई।",
    });
  }
});


// Setup dev vs production servers
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Full-stack server running on http://localhost:${PORT}`);
  });
});
