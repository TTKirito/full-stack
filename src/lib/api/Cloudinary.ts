import cloudinary from "cloudinary";

export const Cloudinary = {
  upload: async (image: string) => {
    /* eslint-diable @typescript-eslint/camelcase */
    const res = await cloudinary.v2.uploader.upload(image, {
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
      folder: "TH_Assets/",
    });

    return res.secure_url;
    /* eslint-diable @typescript-eslint/camelcase */
  },
};
