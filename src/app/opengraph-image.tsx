import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6b0f2b 0%, #3f0819 100%)",
          color: "#fdf8f2",
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 16 }}>❤</div>
        <div style={{ fontSize: 72, fontWeight: 700 }}>Moner Manush</div>
        <div style={{ fontSize: 32, marginTop: 12, color: "#e7cf9a" }}>
          A safe, private dating platform for adults in Bangladesh
        </div>
      </div>
    ),
    { ...size },
  );
}
