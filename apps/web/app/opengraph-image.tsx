import { ImageResponse } from "next/og";
import { siteDescription, siteName, siteTagline } from "./lib/site";

export const alt = siteDescription;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [fontMedium, fontSemiBold] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvSniyM0.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvcXlyM0.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background:
            "linear-gradient(165deg, #EDF0F5 0%, #FFFFFF 58%, #F7FAFF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,113,227,0.16) 0%, rgba(0,113,227,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            right: -60,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(91,121,240,0.14) 0%, rgba(91,121,240,0) 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(0,113,227,0.08)",
              color: "#0066CC",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {siteTagline}
          </div>
        </div>
        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "-3px",
            color: "#111111",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: "-1.2px",
            color: "#1D1D1F",
            lineHeight: 1.15,
            maxWidth: 900,
            marginBottom: 28,
          }}
        >
          Someone real who actually picks up.
        </div>
        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 28,
            fontWeight: 500,
            color: "#6E6E73",
            lineHeight: 1.35,
            maxWidth: 820,
          }}
        >
          {siteDescription}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 80,
            fontFamily: "Bricolage Grotesque",
            fontSize: 24,
            fontWeight: 500,
            color: "#0071E3",
          }}
        >
          callsomeone.org
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: fontMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Bricolage Grotesque",
          data: fontSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
