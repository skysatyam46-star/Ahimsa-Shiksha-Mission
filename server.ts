import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import ImageKit from "imagekit";
import { createServer as createViteServer } from "vite";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
    linksDocs.forEach(doc => {
      const item = doc.data();
      if (item.status === "published") {
        links.push(item);
      }
    });

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
    linksDocs.forEach(doc => {
      links.push(doc.data());
    });
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

    return res.json({ success: true });
  } catch (error: any) {
    console.error("[ServerCMS] Error deleting content from Firestore:", error);
    return res.status(500).json({ success: false, error: "Failed to delete content from Firestore." });
  }
});

// 7b. Upload Image (Supports ImageKit CDN or Local Server Storage Fallback)
app.post("/api/admin/upload-image", requireAdmin, async (req, res) => {
  try {
    const { file, fileName } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, error: "No image file provided for upload." });
    }

    const { ik, missing } = getImageKitInstance();
    // 1. Primary: Use ImageKit if credentials are fully provided in env
    if (ik && missing.length === 0) {
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
    }

    // 2. Fallback: Save locally on server if ImageKit secrets are not configured
    console.info("[LocalUpload] ImageKit credentials not configured. Saving image to local server storage...");
    let fileBuffer: Buffer;
    let ext = "jpg";

    if (typeof file === "string" && file.startsWith("data:")) {
      const match = file.match(/^data:(image\/[a-zA-Z0-9+-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        ext = mimeType.split("/")[1] || "jpg";
        if (ext === "jpeg") ext = "jpg";
        fileBuffer = Buffer.from(match[2], "base64");
      } else {
        const parts = file.split(",");
        fileBuffer = Buffer.from(parts[1] || file, "base64");
      }
    } else if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
      return res.json({
        success: true,
        url: file,
        fileId: `url_${Date.now()}`,
      });
    } else if (typeof file === "string") {
      fileBuffer = Buffer.from(file, "base64");
    } else {
      return res.status(400).json({ success: false, error: "Invalid image file payload." });
    }

    const fileId = `local_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const cleanFileName = `${fileId}.${ext}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    fs.writeFileSync(filePath, fileBuffer);
    const localUrl = `/uploads/${cleanFileName}`;

    console.info(`[LocalUpload] Image saved successfully! URL: ${localUrl}, fileId: ${fileId}`);
    return res.json({
      success: true,
      url: localUrl,
      fileId,
    });
  } catch (err: any) {
    console.error("[Upload] Upload failed:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Failed to upload image",
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
