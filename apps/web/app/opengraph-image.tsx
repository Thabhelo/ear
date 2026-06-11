import { ImageResponse } from "next/og";
import { siteDescription, siteName, siteTagline } from "./lib/site";

export const alt = siteDescription;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  background: "linear-gradient(179deg, #EDF0F5 -43.55%, #FFFFFF 90.05%)",
  orange: "#E8642A",
  orangeLight: "#FF9A5C",
  orangeDeep: "#B3402A",
  orangeTint: "rgba(232,100,42,0.12)",
  peach: "rgba(255,179,122,0.22)",
  peachSoft: "rgba(255,212,180,0.16)",
  ink: "#111111",
  muted: "rgba(0,0,0,0.55)",
};

export default async function Image() {
  const [fontLight, fontMedium, fontSemiBold] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvUXiyM0.ttf"
    ).then((res) => res.arrayBuffer()),
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
          background: colors.background,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -140,
            top: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(232,100,42,0.24), rgba(255,212,180,0.14), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255,179,122,0.20), rgba(244,239,251,0.12), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "42%",
            bottom: -180,
            width: 720,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255,179,122,0.22), rgba(255,212,180,0.10), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: colors.orange,
            }}
          />
          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "lowercase",
              color: "rgba(0,0,0,0.75)",
            }}
          >
            {siteTagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 104,
              fontWeight: 600,
              letterSpacing: "-3px",
              color: colors.ink,
              lineHeight: 1,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              width: 6,
              height: 88,
              borderRadius: 999,
              background: `linear-gradient(180deg, ${colors.orangeLight} 0%, ${colors.orange} 100%)`,
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: "-2px",
            color: colors.ink,
            lineHeight: 1.08,
            maxWidth: 920,
            marginBottom: 24,
          }}
        >
          Someone real who actually picks up.
        </div>

        <div
          style={{
            fontFamily: "Bricolage Grotesque",
            fontSize: 28,
            fontWeight: 500,
            color: colors.muted,
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
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${colors.orangeLight} 0%, ${colors.orange} 100%)`,
              boxShadow: "0 10px 24px rgba(232,100,42,0.28)",
            }}
          />
          <div
            style={{
              fontFamily: "Bricolage Grotesque",
              fontSize: 24,
              fontWeight: 600,
              color: colors.orangeDeep,
            }}
          >
            callsomeone.org
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
