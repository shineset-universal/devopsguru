import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadCertificate(
  pdfBuffer: Buffer,
  studentId: number,
  courseId: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const publicId = `certificates/student_${studentId}_course_${courseId}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
        overwrite: true,
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(pdfBuffer);
  });
}
