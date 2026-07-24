import { AwsClient } from "aws4fetch";

// Cloudflare R2 uploads via the S3-compatible API. Dormant until the R2 env
// vars are set (Railway variables / .env):
//   R2_ACCOUNT_ID        Cloudflare account id (dashboard sidebar)
//   R2_ACCESS_KEY_ID     from an R2 API token (Object Read & Write)
//   R2_SECRET_ACCESS_KEY from the same token
//   R2_BUCKET            bucket name (e.g. portfolio-images)
//   R2_PUBLIC_URL        the bucket's public base URL, no trailing slash
//                        (r2.dev development URL or a custom domain)

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

export async function uploadToR2(
  key: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  if (!r2Configured()) throw new Error("R2 is not configured");
  const client = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  });
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`;
  const res = await client.fetch(endpoint, {
    method: "PUT",
    headers: {
      "content-type": contentType,
      // Uploaded assets are content-addressed by timestamped key — safe to
      // cache aggressively at the edge.
      "cache-control": "public, max-age=31536000, immutable",
    },
    body: bytes as unknown as BodyInit,
  });
  if (!res.ok) {
    throw new Error(`R2 upload failed: ${res.status} ${await res.text()}`);
  }
  return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
}
