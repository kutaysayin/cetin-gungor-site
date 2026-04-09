"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              color: "#1a2744",
              marginBottom: "1rem",
            }}
          >
            Beklenmeyen Bir Hata Olustu
          </h1>
          <p
            style={{
              color: "#868e96",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Uygulamada kritik bir hata meydana geldi. Lutfen sayfayi yenileyin.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#1a2744",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sayfayi Yenile
          </button>
        </div>
      </body>
    </html>
  );
}
