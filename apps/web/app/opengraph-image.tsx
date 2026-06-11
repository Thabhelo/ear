import { ImageResponse } from "next/og";
import {
  siteHeadline,
  siteName,
  siteTagline,
  siteUrl,
} from "./lib/site";

export const alt = siteHeadline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  background: "linear-gradient(179deg, #EDF0F5 -43.55%, #FFFFFF 90.05%)",
  orange: "#E8642A",
  ink: "#111111",
  muted: "rgba(0,0,0,0.55)",
  faint: "rgba(0,0,0,0.08)",
};

export default async function Image() {
  const [fontLight, fontMedium] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvUXiyM0.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvSniyM0.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  const domain = siteUrl.replace(/^https?:\/\//, "");

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
          padding: "80px 96px",
          background: colors.background,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-8%",
            top: "-18%",
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,212,180,0.42) 0%, rgba(255,236,220,0.18) 42%, rgba(255,255,255,0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-10%",
            top: "-12%",
            width: 480,
            height: 480,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,228,210,0.34) 0%, rgba(255,244,236,0.14) 45%, rgba(255,255,255,0) 74%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "28%",
            bottom: "-22%",
            width: 640,
            height: 360,
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,219,196,0.28) 0%, rgba(255,240,230,0.12) 48%, rgba(255,255,255,0) 76%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 36,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.88)",
              border: `1px solid ${colors.faint}`,
              boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.orange,
              }}
            />
            <div
              style={{
                fontFamily: "Bricolage Grotesque",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "lowercase",
                color: "rgba(0,0,0,0.72)",
              }}
            >
              {siteTagline}
            </div>
          </div>

          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 96,
              fontWeight: 300,
              letterSpacing: "-3px",
              color: colors.ink,
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
            {siteName}
          </div>

          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 44,
              fontWeight: 300,
              letterSpacing: "-1.6px",
              color: colors.ink,
              lineHeight: 1.12,
              maxWidth: 760,
              marginBottom: 40,
            }}
          >
            {siteHeadline}
          </div>

          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: colors.muted,
            }}
          >
            {domain}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: fontLight,
          style: "normal",
          weight: 300,
        },
        {
          name: "Bricolage Grotesque",
          data: fontMedium,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
