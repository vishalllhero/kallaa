import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../_core/env";

cloudinary.config({
  cloud_name: ENV.cloudinary.cloudName,
  api_key: ENV.cloudinary.apiKey,
  api_secret: ENV.cloudinary.apiSecret,
});

export default cloudinary;
