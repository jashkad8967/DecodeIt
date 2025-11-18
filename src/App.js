// App.jsx
import React, { useState, useEffect, useMemo } from "react";

function App() {
  const [birthday, setBirthday] = useState("");
  const [birthdayParts, setBirthdayParts] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [step, setStep] = useState(1); // 1: input birthday, 2: decode screen
  const [encodedSentence, setEncodedSentence] = useState("");
  const [goodDeed, setGoodDeed] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(0);
  const [decodeShift, setDecodeShift] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adOffsets, setAdOffsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [view, setView] = useState("home");

  useEffect(() => {
    const selectors = [
      ".ad-banner",
      ".adsbygoogle",
      "[data-ad-slot]",
      ".ad-container",
      "#top-ads",
      "#bottom-ads",
    ];

    const computeOffsets = () => {
      const banners = Array.from(
        document.querySelectorAll(selectors.join(","))
      );

      let top = 0;
      let bottom = 0;
      let left = 0;
      let right = 0;

      banners.forEach((banner) => {
        if (!banner.offsetHeight || !banner.getBoundingClientRect) return;
        const rect = banner.getBoundingClientRect();
        const isFixed =
          getComputedStyle(banner).position === "fixed" ||
          banner.dataset?.adPosition === "fixed";

        if (!isFixed) return;

        if (rect.top <= 5) {
          top = Math.max(top, rect.height);
        } else if (window.innerHeight - rect.bottom <= 5) {
          bottom = Math.max(bottom, rect.height);
        }

        const marginBuffer = 40;
        if (rect.left <= window.innerWidth / 2) {
          left = Math.max(left, rect.width + marginBuffer);
        }
        if (rect.right >= window.innerWidth / 2) {
          right = Math.max(right, rect.width + marginBuffer);
        }
      });

      setAdOffsets((prev) => {
        if (
          prev.top === top &&
          prev.bottom === bottom &&
          prev.left === left &&
          prev.right === right
        )
          return prev;
        return { top, bottom, left, right };
      });
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(computeOffsets);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", computeOffsets);
    computeOffsets();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeOffsets);
    };
  }, []);

  const MAX_SENTENCE_WORDS = 10;
  const CARD_MAX_WIDTH = 640;
  const FRAME_WIDTH = CARD_MAX_WIDTH + 120;
  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, idx) => String(currentYear - idx));
  }, []);
  const daysInMonth = useMemo(() => {
    if (!birthdayParts.year || !birthdayParts.month) return 31;
    return new Date(
      Number(birthdayParts.year),
      Number(birthdayParts.month),
      0
    ).getDate();
  }, [birthdayParts]);
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, idx) =>
        String(idx + 1).padStart(2, "0")
      ),
    [daysInMonth]
  );
  const STARS = useMemo(
    () =>
      Array.from({ length: 500 }).map((_, idx) => ({
        id: idx,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
      })),
    []
  );
  const decorOrbs = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, idx) => ({
        id: idx,
        size: 100 + Math.random() * 140,
        top: `${Math.random() * 80 + 5}%`,
        left: `${Math.random() * 80 + 5}%`,
        blur: Math.random() * 25 + 15,
        opacity: Math.random() * 0.25 + 0.05,
      })),
    []
  );
  const zodiacInsights = [
    { sign: "Aries", note: "Bold trailblazers who thrive on courageous action." },
    { sign: "Taurus", note: "Grounded nurturers that value stability and loyalty." },
    { sign: "Gemini", note: "Curious communicators energized by sharing ideas." },
    { sign: "Cancer", note: "Empathetic protectors with a deep sense of care." },
    { sign: "Leo", note: "Warm-hearted leaders who inspire by example." },
    { sign: "Virgo", note: "Detail-focused helpers dedicated to practical service." },
    { sign: "Libra", note: "Harmony seekers balancing fairness and connection." },
    { sign: "Scorpio", note: "Powerful transformers who value emotional truth." },
    { sign: "Sagittarius", note: "Optimistic explorers chasing meaning and wisdom." },
    { sign: "Capricorn", note: "Disciplined builders committed to long-term impact." },
    { sign: "Aquarius", note: "Visionary humanitarians driven by innovation." },
    { sign: "Pisces", note: "Compassionate dreamers attuned to collective healing." },
  ];

  const pollinationsFetch = async (prompt) => {
    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
    );
    if (!response.ok) {
      throw new Error("AI request failed");
    }
    const text = await response.text();
    return text.trim();
  };

  const extractZodiac = (rawText) => {
    return rawText
      .split(/\s|,|\./)
      .filter(Boolean)[0]
      .replace(/[^a-z]/gi, "")
      .trim();
  };

  // Caesar cipher encoding
  const encodeSentence = (sentence) => {
    const shift = Math.floor(Math.random() * 25) + 1;
    const encoded = sentence
      .split("")
      .map((char) => {
        if (/[a-z]/i.test(char)) {
          const code = char.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join("");
    return { encoded, shift };
  };

  const buildBirthdayISO = (parts) => {
    const { year, month, day } = parts;
    if (!year || !month || !day) return "";
    return `${year}-${month}-${day}`;
  };

  const updateBirthdayParts = (field, value) => {
    setBirthdayParts((prev) => {
      const next = { ...prev, [field]: value };
      if ((field === "month" || field === "year") && next.day) {
        const maxDay = new Date(
          Number(next.year || new Date().getFullYear()),
          Number(next.month || 1),
          0
        ).getDate();
        if (Number(next.day) > maxDay) {
          next.day = String(maxDay).padStart(2, "0");
        }
      }
      const iso = buildBirthdayISO(next);
      setBirthday(iso);
      return next;
    });
  };

  const normalizeSentence = (text) => {
    let cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned.endsWith(".")) {
      cleaned = `${cleaned}.`;
    }
    return cleaned;
  };

  const isConcise = (text) => text.split(/\s+/).length <= MAX_SENTENCE_WORDS;

  const handleBirthdaySubmit = async () => {
    const isoBirthday = buildBirthdayISO(birthdayParts);
    if (!isoBirthday) {
      setError("Please select a complete birthday.");
      return;
    }
    setBirthday(isoBirthday);
    try {
      setLoading(true);
      setError("");

      const zodiacPrompt = `Given the birthday ${isoBirthday}, which zodiac sign does it correspond to? Answer with only the zodiac sign.`;
      const zodiacResponse = await pollinationsFetch(zodiacPrompt);
      const zodiacSign = extractZodiac(zodiacResponse);

      if (!zodiacSign) {
        throw new Error("Could not determine zodiac sign.");
      }

      const deedPrompt = `Respond with exactly one clear sentence (less than or equal to ${MAX_SENTENCE_WORDS} words) giving the user a task as a good deed to help someone or do an action that aligns that with the nature of someone whose zodiac sign is ${zodiacSign}. Do not add extra commentary.`;
      const deedResponse = await pollinationsFetch(deedPrompt);
      const sentence = normalizeSentence(deedResponse);

      if (!sentence || sentence.length < 5) {
        throw new Error("AI returned an invalid sentence.");
      }

      if (!isConcise(sentence)) {
        throw new Error("AI returned a sentence that was not concise enough.");
      }

      const { encoded, shift } = encodeSentence(sentence);
      setGoodDeed(sentence);
      setEncodedSentence(encoded);
      setShift(shift);
      setDecodeShift((26 - shift) % 26 || 26);
      setUserInput("");
      setMessage("");
      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === goodDeed.toLowerCase()) {
      setMessage("✅ Correct! Well done!");
    } else {
      setMessage("❌ Incorrect, try again!");
    }
  };

  const SAFE_PADDING = 24;
  const availableWidth =
    typeof window !== "undefined"
      ? window.innerWidth - SAFE_PADDING * 2
      : FRAME_WIDTH;

  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    fontFamily: "'Space Grotesk', Arial, sans-serif",
    color: "#f7f8fb",
    background: "#1f2128",
    paddingTop: 120 + adOffsets.top,
    paddingBottom: 160 + adOffsets.bottom,
    paddingLeft: SAFE_PADDING,
    paddingRight: SAFE_PADDING,
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  const shellStyle = {
    width: "100%",
    maxWidth: Math.min(FRAME_WIDTH, Math.max(360, availableWidth)),
    minWidth: "320px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    alignItems: "stretch",
    padding: 0,
    boxSizing: "border-box",
  };

  const topBarStyle = {
    position: "sticky",
    top: Math.max(adOffsets.top + 16, 16),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 26px",
    borderRadius: "24px",
    background: "rgba(4, 6, 18, 0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    zIndex: 5,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    width: "100%",
    maxWidth: FRAME_WIDTH,
    alignSelf: "center",
  };

  const navButtonStyle = (active) => ({
    padding: "10px 20px",
    borderRadius: "999px",
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    color: active ? "#080a1e" : "#f0f4ff",
    background: active
      ? "linear-gradient(135deg, #f8fbff, #cdd7ff)"
      : "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const mainCardStyle = {
    width: "100%",
    maxWidth: CARD_MAX_WIDTH,
    margin: "0 auto",
    background: "#272a33",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "32px",
    padding: "48px 48px 56px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    textAlign: "center",
    backdropFilter: "blur(18px)",
    position: "relative",
    zIndex: 2,
  };

  const buttonStyle = (disabled = false) => ({
    padding: "12px 28px",
    marginTop: "24px",
    fontSize: "16px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: "none",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, rgba(107,123,255,0.9), rgba(181,75,255,0.9))",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(107,123,255,0.4)",
    transition: "transform 0.2s ease",
  });

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#f7f8fb",
    marginTop: "16px",
    outline: "none",
  };
  const selectStyle = {
    ...inputStyle,
    marginTop: "6px",
    background: "#1a1c24",
    color: "#f7f8fb",
    cursor: "pointer",
  };
  const selectLabelStyle = {
    fontSize: "12px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
  };
  const dateGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "14px",
    width: "100%",
    marginTop: "12px",
  };

  const gradientFrameStyle = {
    width: "100%",
    maxWidth: FRAME_WIDTH,
    margin: "0 auto",
    padding: "1.5px",
    borderRadius: "36px",
    background: "linear-gradient(135deg, rgba(101,130,255,0.6), rgba(255,106,179,0.4))",
    boxShadow: "0 35px 90px rgba(0,0,0,0.55)",
  };

  const cardWrapperStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  };

  const CardFrame = ({ children }) => (
    <div style={cardWrapperStyle}>
      <div style={gradientFrameStyle}>
        <div style={mainCardStyle}>{children}</div>
      </div>
    </div>
  );

  const chipStyle = {
    padding: "6px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    fontSize: "12px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  };

  const highlightTileStyle = {
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  const highlightTiles = [
    { title: "AI-crafted", body: "Free Pollinations model tailors each daily deed." },
    { title: "Caesar Shift", body: "Decode with 26 − shift hint for a fair challenge." },
    { title: "10 words max", body: "Concise instructions keep the mission laser-focused." },
  ];

  const aboutSections = [
    {
      label: "Decode the idea",
      title: "What is a Caesar Cipher?",
      copy:
        "A Caesar cipher rotates every character by a fixed offset. Shift 21 to encrypt, shift 5 forward (or 21 back) to decrypt—simple math that still feels magical.",
    },
    {
      label: "Why deeds matter",
      title: "Good Deeds, Real Impact",
      copy:
        "Small intentional acts trigger social resonance. When prompts mirror your zodiac temperament, it becomes easier to act with authenticity each day.",
    },
  ];

  const footerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "32px",
    borderRadius: "28px",
    background: "#272a33",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    width: "100%",
    maxWidth: FRAME_WIDTH,
    alignSelf: "center",
  };

  const renderExperience = () => {
    const progressValue = step === 1 ? 45 : 95;
    const experienceCopy =
      step === 1
        ? "We’ll read your birth date, ask a free AI for the correct zodiac, and craft a deed tailored to your energy."
        : "Decrypt the prompt, follow the hint, and confirm the decoded text to log today’s good deed.";

    return (
      <CardFrame>
        <div style={{ maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span style={chipStyle}>{step === 1 ? "Step 1 / 2" : "Step 2 / 2"}</span>
            <span style={chipStyle}>Daily ritual</span>
            <span style={chipStyle}>Zodiac fused</span>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
            {step === 1 ? "Input → AI prompts" : "Cipher → Decode check"}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: 6,
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressValue}%`,
              height: "100%",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #8ea4ff, #ff7bc5)",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px" }}>Share Your Birthday</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "28px" }}>
              {experienceCopy}
            </p>
            <div style={dateGridStyle}>
              <div>
                <label style={selectLabelStyle}>Month</label>
                <select
                  value={birthdayParts.month}
                  onChange={(e) => updateBirthdayParts("month", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select month</option>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={selectLabelStyle}>Day</label>
                <select
                  value={birthdayParts.day}
                  onChange={(e) => updateBirthdayParts("day", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select day</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={selectLabelStyle}>Year</label>
                <select
                  value={birthdayParts.year}
                  onChange={(e) => updateBirthdayParts("year", e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Select year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleBirthdaySubmit}
              disabled={loading}
              style={buttonStyle(loading)}
            >
              {loading ? "Consulting the stars..." : "Reveal today’s quest"}
            </button>
            {error && (
              <p style={{ color: "#ff8a8a", marginTop: "20px" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px" }}>Uncover Your Good Deed</h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              {experienceCopy}
            </p>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                margin: "20px auto",
                padding: "18px 20px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.04)",
                wordBreak: "break-word",
              }}
            >
              {encodedSentence}
            </div>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>
              Hint: Rotate letters {decodeShift} steps forward to reveal the truth.
            </p>

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the decoded sentence"
              style={{ ...inputStyle, width: "100%", marginTop: "24px" }}
            />

            <button
              onClick={checkAnswer}
              style={{ ...buttonStyle(false), width: "100%" }}
            >
              Submit answer
            </button>

            {message && (
              <div
                style={{
                  marginTop: "24px",
                  fontSize: "18px",
                  color: message.includes("Correct") ? "#7af5c3" : "#ff8a8a",
                }}
              >
                {message}
              </div>
            )}
          </>
        )}

        <div style={{ width: "100%", marginTop: "28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
            }}
          >
            {highlightTiles.map((tile) => (
              <div key={tile.title} style={highlightTileStyle}>
                <p style={{ margin: "0 0 6px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{tile.title}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      </CardFrame>
    );
  };

  const renderAbout = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
      {aboutSections.map((section) => (
        <CardFrame key={section.title}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              {section.label}
            </p>
            <h2 style={{ fontSize: "30px", margin: "10px 0" }}>{section.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              {section.copy}
            </p>
          </div>
        </CardFrame>
      ))}

      <CardFrame>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
            Zodiac essence
          </p>
          <h2 style={{ fontSize: "30px", margin: "10px 0" }}>Nature of Each Sign</h2>
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {zodiacInsights.map((item) => (
              <div
                key={item.sign}
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{item.sign}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </CardFrame>
    </div>
  );

  return (
    <div style={pageStyle}>
      {decorOrbs.map((orb) => (
        <div
          key={orb.id}
          style={{
            position: "absolute",
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(116,130,255,0.18), rgba(31,33,40,0))",
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}
      {STARS.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
            animation: `twinkle 3s ease-in-out ${star.delay}s infinite alternate`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
      <div style={shellStyle}>
        <header style={topBarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ff6bc5, #7076ff)",
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)" }}>
                Decode Daily
              </p>
              <h1 style={{ margin: 0, fontSize: "20px" }}>Zodiac Cipher</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={navButtonStyle(view === "home")} onClick={() => setView("home")}>
              Experience
            </button>
            <button style={navButtonStyle(view === "about")} onClick={() => setView("about")}>
              About
            </button>
          </div>
        </header>

        <main>
        {view === "home" ? renderExperience() : renderAbout()}
        </main>

        <footer style={footerStyle}>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "16px" }}>Contact Support</h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px" }}>
              Have questions or feedback? Drop us a line.
            </p>
            <input
              type="email"
              placeholder="you@email.com"
              style={{
                ...inputStyle,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "13px",
                width: "75%"
              }}
            />
            <button style={{ ...buttonStyle(false), width: "80%" }}>
              Send a hello
            </button>
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "16px" }}>Terms & Conditions</h3>
            <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6, fontSize: "13px" }}>
              This experience is for inspiration only. Deeds are suggestions; apply your own judgment and local guidelines. By using this
              app you agree to act responsibly and respect others’ boundaries.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
