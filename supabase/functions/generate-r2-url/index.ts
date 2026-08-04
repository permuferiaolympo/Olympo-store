// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const { filename, contentType } = await req.json()

    if (!filename || !contentType) {
      return new Response(JSON.stringify({ error: 'filename and contentType are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')
    const accessKeyId = Deno.env.get('CLOUDFLARE_ACCESS_KEY_ID')
    const secretAccessKey = Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY')

    if (!accountId || !accessKeyId || !secretAccessKey) {
       return new Response(JSON.stringify({ error: 'Missing Cloudflare credentials in Edge Function environment' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    // Create a unique file key
    const timestamp = Date.now();
    const fileExtension = filename.split('.').pop();
    const fileKey = `products/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: 'product-images',
      Key: fileKey,
      ContentType: contentType,
    })

    // URL is valid for 5 minutes
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    return new Response(JSON.stringify({ url: signedUrl, fileKey }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
