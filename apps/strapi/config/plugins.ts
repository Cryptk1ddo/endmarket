export default ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-aws-s3",
      providerOptions: {
        s3Options: {
          // Cloudflare R2 is S3-compatible
          credentials: {
            accessKeyId: env("R2_ACCESS_KEY_ID"),
            secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
          },
          region: "auto",
          endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
          params: {
            Bucket: env("R2_BUCKET_NAME"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },
})
