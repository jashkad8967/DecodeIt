// App.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getUserData, saveUserData, getProfile, getAccountId, getAllUsersData } from "./utils/storage";
import { getTodayDate, isSameDay, buildBirthdayISO } from "./utils/dateHelpers";
import { encodeSentence } from "./utils/cipher";
import { pollinationsFetch, extractZodiac, normalizeSentence, isConcise } from "./utils/ai";
import { processImageFile } from "./utils/imageHelpers";
import { signOut, signIn, register, deleteAccount, updateProfile, resetPassword } from "./utils/authHelpers";
import { calculateStreak, calculateSolvePoints, calculateUploadPoints, hasCompletedToday, createDeed } from "./utils/deedHelpers";
import { MAX_SENTENCE_WORDS, zodiacInsights } from "./constants/zodiac";
import { CARD_MAX_WIDTH, FRAME_WIDTH, SAFE_PADDING } from "./constants/config";
import { useAdOffsets } from "./hooks/useAdOffsets";
import { monthOptions, useYearOptions, useDayOptions } from "./utils/dateOptions";
import { CardFrame } from "./components/CardFrame";
import { BirthdayInput } from "./components/BirthdayInput";
import { ImageUpload } from "./components/ImageUpload";
import { getTextColor, getCardBg, getCardBorder, getInputStyle } from "./utils/themeHelpers";
import {
  mainCardStyle,
  buttonStyle,
  inputStyle,
  selectStyle,
  selectLabelStyle,
  dateGridStyle,
  chipStyle,
  topBarStyle,
  navButtonStyle,
  footerStyle,
} from "./styles/theme";

function App() {
  const [profile, setProfile] = useState(getProfile());
  const [isSignedIn, setIsSignedIn] = useState(!!getProfile());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthdayParts, setBirthdayParts] = useState({
    month: "",
    day: "",
    year: "",
  });
  const [step, setStep] = useState(1);
  const [encodedSentence, setEncodedSentence] = useState("");
  const [goodDeed, setGoodDeed] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(0);
  const [decodeShift, setDecodeShift] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("home");
  const accountId = useMemo(() => getAccountId(profile), [profile]);
  const [userData, setUserData] = useState(() => getUserData(getAccountId(profile)));
  const [deedCompleted, setDeedCompleted] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [pendingDeed, setPendingDeed] = useState(null);
  const [editingDeedIndex, setEditingDeedIndex] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedProfile = getProfile();
    return savedProfile?.theme || "dark";
  });
  const [username, setUsername] = useState(() => {
    const savedProfile = getProfile();
    return savedProfile?.username || "";
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactMessageSuccess, setContactMessageSuccess] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [settingsBirthdayParts, setSettingsBirthdayParts] = useState(() => {
    const savedProfile = getProfile();
    if (savedProfile?.birthday) {
      const date = new Date(savedProfile.birthday);
      return {
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        year: String(date.getFullYear()),
      };
    }
    return { month: "", day: "", year: "" };
  });

  const adOffsets = useAdOffsets();
  const yearOptions = useYearOptions();
  const dayOptions = useDayOptions(birthdayParts);
  const settingsDayOptions = useDayOptions(settingsBirthdayParts);

  const updateBirthdayParts = useCallback((field, value) => {
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
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleUserInputChange = useCallback((e) => {
    setUserInput(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageDataUrl = await processImageFile(file);
      setImageFile(file);
      setImagePreview(imageDataUrl);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleContactNameChange = useCallback((e) => {
    setContactName(e.target.value);
  }, []);

  const handleContactEmailChange = useCallback((e) => {
    setContactEmail(e.target.value);
  }, []);

  const handleContactMessageChange = useCallback((e) => {
    setContactMessage(e.target.value);
  }, []);

  const handleSignOut = useCallback(() => {
    const resetState = signOut();
    setProfile(resetState.profile);
    setIsSignedIn(resetState.isSignedIn);
    setEmail(resetState.email);
    setBirthday(resetState.birthday);
    setBirthdayParts(resetState.birthdayParts);
    setStep(resetState.step);
    setView(resetState.view);
    setMessage(""); // Clear any completion messages
    setError(""); // Clear any error messages
    setDeedCompleted(false);
    setShowImageUpload(false);
    setImagePreview(null);
    setImageFile(null);
    setPendingDeed(null);
    setEncodedSentence(""); // Clear encoded sentence
    setGoodDeed(""); // Clear good deed
    setUserInput(""); // Clear user input
    // Reload user data for guest account
    const guestData = getUserData("guest");
    setUserData(guestData);
  }, []);

  const handleSignInClick = useCallback(() => {
    setView("home");
    setStep(0.5); // Sign-in step
    setEmail("");
    setBirthdayParts({ month: "", day: "", year: "" });
    setError("");
  }, []);

  const handleSignIn = useCallback(() => {
    try {
      const signedInProfile = signIn(email, password);
      setProfile(signedInProfile);
      setIsSignedIn(true);
      setBirthday(signedInProfile.birthday);
      setPassword("");
      setError("");
      // Update theme and username from profile
      setTheme(signedInProfile.theme || "dark");
      setUsername(signedInProfile.username || signedInProfile.email.split("@")[0]);
      // Update settings birthday parts
      if (signedInProfile.birthday) {
        const date = new Date(signedInProfile.birthday);
        setSettingsBirthdayParts({
          month: String(date.getMonth() + 1).padStart(2, '0'),
          day: String(date.getDate()).padStart(2, '0'),
          year: String(date.getFullYear()),
        });
      } else {
        setSettingsBirthdayParts({ month: "", day: "", year: "" });
      }
      // Reload user data for the signed-in account
      const accountData = getUserData(signedInProfile.email);
      setUserData(accountData);
      // Will auto-run prompt via useEffect
    } catch (err) {
      setError(err.message);
    }
  }, [email, password]);

  const runPrompt = async (isoBirthday) => {
    if (!isoBirthday) return;

    const today = getTodayDate();
    if (isSameDay(userData.lastDeedDate, today) && userData.pastDeeds.some(d => d.date === today)) {
      setError("You've already completed today's good deed! Come back tomorrow for a new challenge.");
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

      if (!isConcise(sentence, MAX_SENTENCE_WORDS)) {
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

  useEffect(() => {
    // Load user data when profile/account changes
    const currentAccountId = getAccountId(profile);
    const currentUserData = getUserData(currentAccountId);
    setUserData(currentUserData);
    // Update theme and username from profile
    if (profile) {
      setTheme(profile.theme || "dark");
      setUsername(profile.username || profile.email?.split("@")[0] || "");
    }
  }, [profile]);

  useEffect(() => {
    // Auto-run prompt when signed in (for existing users or after registration)
    if (isSignedIn && profile && profile.birthday && !loading) {
      // After successful sign-in (step 0.5) or registration (step 1), run prompt
      if (step === 0.5 || step === 1) {
        runPrompt(profile.birthday);
      }
    }
  }, [isSignedIn, profile, step]);

  useEffect(() => {
    // Only check if already completed when signed in
    if (!isSignedIn) {
      setDeedCompleted(false);
      // Clear any "already completed" messages for guests
      if (message.includes("already completed")) {
        setMessage("");
      }
      if (error.includes("already completed")) {
        setError("");
      }
      return;
    }
    
    const today = getTodayDate();
    const currentAccountId = getAccountId(profile);
    const currentUserData = getUserData(currentAccountId);
    if (isSameDay(currentUserData.lastDeedDate, today) && currentUserData.pastDeeds.some(d => d.date === today)) {
      setDeedCompleted(true);
      if (step === 2) {
        setMessage("✅ You've already completed today's good deed! Come back tomorrow.");
      }
    } else {
      setDeedCompleted(false);
      if (step === 2 && message.includes("already completed")) {
        setMessage("");
      }
    }
  }, [profile, step, isSignedIn, message, error]);

  const handleProfileSubmit = () => {
    try {
      const isoBirthday = buildBirthdayISO(birthdayParts);
      const newProfile = register(email, password, isoBirthday);
      setProfile(newProfile);
      setIsSignedIn(true);
      setBirthday(isoBirthday);
      setPassword("");
      setError("");
      // Update theme and username from new profile
      setTheme(newProfile.theme || "dark");
      setUsername(newProfile.username || newProfile.email.split("@")[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameUpdate = useCallback(() => {
    if (!isSignedIn || !profile) return;
    if (!username || username.trim().length === 0) {
      setError("Username cannot be empty.");
      return;
    }
    try {
      const updatedProfile = updateProfile(profile.email, { username: username.trim() });
      setProfile(updatedProfile);
      setEditingUsername(false);
      setError("");
      setMessage("Username updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }, [username, isSignedIn, profile]);

  const handleBirthdayUpdate = useCallback(() => {
    if (!isSignedIn || !profile) return;
    try {
      const isoBirthday = buildBirthdayISO(settingsBirthdayParts);
      if (!isoBirthday) {
        setError("Please select a valid birthday.");
        return;
      }
      const updatedProfile = updateProfile(profile.email, { birthday: isoBirthday });
      setProfile(updatedProfile);
      setBirthday(isoBirthday);
      setEditingBirthday(false);
      setError("");
      setMessage("Birthday updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  }, [settingsBirthdayParts, isSignedIn, profile]);

  const updateSettingsBirthdayParts = useCallback((field, value) => {
    setSettingsBirthdayParts((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  }, []);

  const handleThemeToggle = useCallback(() => {
    if (!isSignedIn || !profile) return;
    const newTheme = theme === "dark" ? "light" : "dark";
    try {
      const updatedProfile = updateProfile(profile.email, { theme: newTheme });
      setProfile(updatedProfile);
      setTheme(newTheme);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [theme, isSignedIn, profile]);

  const handlePasswordReset = useCallback(() => {
    if (!isSignedIn || !profile) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    try {
      const updatedProfile = resetPassword(profile.email, currentPassword, newPassword, confirmPassword);
      setProfile(updatedProfile);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setMessage("Password updated successfully!");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    }
  }, [currentPassword, newPassword, confirmPassword, isSignedIn, profile]);

  const handleDeleteAccount = useCallback(() => {
    if (!isSignedIn || !profile) return;
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.")) {
      return;
    }
    try {
      deleteAccount(profile.email);
      // Sign out after deletion
      const resetState = signOut();
      setProfile(resetState.profile);
      setIsSignedIn(resetState.isSignedIn);
      setEmail(resetState.email);
      setBirthday(resetState.birthday);
      setBirthdayParts(resetState.birthdayParts);
      setStep(resetState.step);
      setView(resetState.view);
      setMessage("");
      setDeedCompleted(false);
      setUsername("");
      setTheme("dark");
      // Reload user data for guest account
      const guestData = getUserData("guest");
      setUserData(guestData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [isSignedIn, profile]);

  const handleBirthdaySubmit = async (providedBirthday = null) => {
    const isoBirthday = providedBirthday || buildBirthdayISO(birthdayParts);
    if (!isoBirthday) {
      setError("Please select a complete birthday.");
      return;
    }
    await runPrompt(isoBirthday);
  };

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() !== goodDeed.toLowerCase()) {
      setMessage("❌ Incorrect, try again!");
      return;
    }

    const currentAccountId = getAccountId(profile);
    const currentUserData = getUserData(currentAccountId);
    
    // Only check if already completed when signed in
    if (isSignedIn && hasCompletedToday(currentUserData)) {
      setMessage("✅ You've already completed today's good deed! Come back tomorrow.");
      return;
    }

    const newStreak = calculateStreak(currentUserData.lastDeedDate, currentUserData.streak);
    const solvePoints = calculateSolvePoints(newStreak); // streak + 1 points for solving on consecutive days

    // Create deed immediately with solve points and go to journal
    const newDeed = createDeed(
      goodDeed,
      solvePoints,
      0, // No upload points yet
      newStreak,
      null // No image required
    );

    const updatedData = {
      ...currentUserData,
      points: currentUserData.points + solvePoints,
      streak: newStreak,
      lastDeedDate: getTodayDate(),
      pastDeeds: [newDeed, ...currentUserData.pastDeeds].slice(0, 100),
    };

    setUserData(updatedData);
    saveUserData(currentAccountId, updatedData);
    setDeedCompleted(true);
    setMessage(`✅ Correct! +${solvePoints} points!`);
    
    // Navigate to journal
    setView("journal");
  };

  const handleImageSubmit = () => {
    if (!imagePreview || !pendingDeed) {
      setError("Please upload an image to complete your good deed.");
      return;
    }

    const currentAccountId = getAccountId(profile);
    const currentUserData = getUserData(currentAccountId);
    const uploadPoints = calculateUploadPoints(pendingDeed.streak); // streak + 1 points for uploading on consecutive days

    const newDeed = createDeed(
      pendingDeed.deed,
      pendingDeed.solvePoints,
      uploadPoints,
      pendingDeed.streak,
      imagePreview
    );

    const updatedData = {
      ...currentUserData,
      points: currentUserData.points + uploadPoints, // Only add upload points since solve points were already added
      streak: pendingDeed.streak,
      lastDeedDate: pendingDeed.date,
      pastDeeds: [newDeed, ...currentUserData.pastDeeds].slice(0, 100),
    };

    setUserData(updatedData);
    saveUserData(currentAccountId, updatedData);
    setDeedCompleted(true);
    setShowImageUpload(false);
    setImagePreview(null);
    setImageFile(null);
    setPendingDeed(null);
    setMessage(`✅ Deed completed! +${uploadPoints} more points! Total: ${pendingDeed.solvePoints + uploadPoints} points! Streak: ${pendingDeed.streak} day${pendingDeed.streak !== 1 ? 's' : ''}`);
  };

  const availableWidth = useMemo(
    () => (typeof window !== "undefined" ? window.innerWidth - SAFE_PADDING * 2 : FRAME_WIDTH),
    []
  );

  const pageStyle = useMemo(
    () => ({
      minHeight: "100vh",
      margin: 0,
      fontFamily: "'Space Grotesk', Arial, sans-serif",
      color: theme === "dark" ? "#f7f8fb" : "#1a202c",
      background: theme === "dark" 
        ? "#1f2128" 
        : "linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)",
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
      transition: "background 0.3s ease, color 0.3s ease",
    }),
    [adOffsets.top, adOffsets.bottom, theme]
  );

  const shellStyle = useMemo(
    () => ({
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
    }),
    [availableWidth]
  );

  const highlightTileStyle = useMemo(() => ({
    padding: "16px",
    borderRadius: "18px",
    background: theme === "light" ? "#edf2f7" : "rgba(0,0,0,0.25)",
    border: theme === "light" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.06)",
  }), [theme]);

  const highlightTiles = [
    { title: "AI-crafted", body: "Free Pollinations model tailors each daily deed." },
    { title: "Caesar Shift", body: "Decode with 26 − shift hint for a fair challenge." },
    { title: "10 words max", body: "Concise instructions keep the mission laser-focused." },
  ];

  const aboutSections = [
    {
      label: "Decode the idea",
      title: "What is a Caesar Cipher?",
      copy: "A Caesar cipher rotates every character by a fixed offset. Shift 21 to encrypt, shift 5 forward (or 21 back) to decrypt—simple math that still feels magical.",
    },
    {
      label: "Why deeds matter",
      title: "Good Deeds, Real Impact",
      copy: "Small intentional acts trigger social resonance. When prompts mirror your zodiac temperament, it becomes easier to act with authenticity each day.",
    },
  ];

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

  const renderExperience = () => {
    const textColor = getTextColor(theme, "primary");
    const textColorSecondary = getTextColor(theme, "secondary");
    const cardBg = getCardBg(theme);
    const cardBorder = getCardBorder(theme);
    
    const progressValue = (step === 0.5 || step === 1 || step === 1.5) ? 45 : 95;
    const experienceCopy =
      (step === 0.5 || step === 1 || step === 1.5)
        ? step === 0.5
          ? "Sign in to access your personalized daily good deeds."
          : "We'll read your birth date, ask a free AI for the correct zodiac, and craft a deed tailored to your energy."
        : "Decrypt the prompt, follow the hint, and confirm the decoded text to log today's good deed.";

    return (
      <CardFrame theme={theme}>
        <div style={{ maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span style={chipStyle(theme)}>
              {step === 0.5 ? "Sign In" : (step === 1 || step === 1.5) ? "Step 1 / 2" : "Step 2 / 2"}
            </span>
            <span style={chipStyle(theme)}>Daily ritual</span>
            <span style={chipStyle(theme)}>Zodiac fused</span>
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: textColorSecondary }}>
            {(step === 0.5 || step === 1 || step === 1.5) ? (step === 0.5 ? "Sign In" : "Input → AI prompts") : "Cipher → Decode check"}
          </p>
        </div>

        <div style={{ width: "100%", height: 6, borderRadius: "999px", background: theme === "light" ? "#e2e8f0" : "rgba(255,255,255,0.08)", marginBottom: "24px", overflow: "hidden" }}>
          <div style={{ width: `${progressValue}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #8ea4ff, #ff7bc5)", transition: "width 0.4s ease" }} />
        </div>

        {!isSignedIn && step === 0.5 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Sign In</h1>
            <p style={{ color: textColor, marginBottom: "28px" }}>
              Enter your email or username and password to sign in to your account.
            </p>
            <input type="text" value={email} onChange={handleEmailChange} placeholder="Email or username" style={getInputStyle(theme)} />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" style={{ ...getInputStyle(theme), marginTop: "12px" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleSignIn} disabled={loading} style={{ ...buttonStyle(loading), width: "100%" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  style={{ 
                    ...buttonStyle(loading), 
                    flex: 1, 
                    background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)", 
                    border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)" 
                  }}
                >
                  Register
                </button>
                <button
                  onClick={() => setStep(1.5)}
                  disabled={loading}
                  style={{ 
                    ...buttonStyle(loading), 
                    flex: 1, 
                    background: theme === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)", 
                    border: theme === "light" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)" 
                  }}
                >
                  Guest
                </button>
              </div>
            </div>
            {error && <p style={{ color: "#ff8a8a", marginTop: "20px" }}>{error}</p>}
          </>
        ) : !isSignedIn && step === 1 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Create Your Profile</h1>
            <p style={{ color: textColor, marginBottom: "28px" }}>
              Sign up with your email, password, and birthday to get personalized daily good deeds based on your zodiac sign.
            </p>
            <input type="email" value={email} onChange={handleEmailChange} placeholder="your@email.com" style={getInputStyle(theme)} />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password (min 4 characters)" style={{ ...getInputStyle(theme), marginTop: "12px" }} />
            <BirthdayInput
              birthdayParts={birthdayParts}
              updateBirthdayParts={updateBirthdayParts}
              monthOptions={monthOptions}
              dayOptions={dayOptions}
              yearOptions={yearOptions}
              theme={theme}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <button onClick={handleSignIn} disabled={loading} style={{ ...buttonStyle(loading), width: "100%" }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div style={{ display: "flex", gap: "12px", width: "100%" }}>
        <button
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  style={{ 
                    ...buttonStyle(loading), 
                    flex: 1, 
                    background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)", 
                    border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)" 
                  }}
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>
                <button
                  onClick={() => setStep(1.5)}
                  disabled={loading}
                  style={{ 
                    ...buttonStyle(loading), 
                    flex: 1, 
                    background: theme === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)", 
                    border: theme === "light" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)" 
                  }}
        >
                  Guest
        </button>
      </div>
            </div>
            {error && <p style={{ color: "#ff8a8a", marginTop: "20px" }}>{error}</p>}
          </>
        ) : !isSignedIn && step === 1.5 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Enter Your Birthday</h1>
            <p style={{ color: textColor, marginBottom: "28px" }}>
              We'll discover your zodiac nature and craft a deed that fits your aura.
            </p>
            <BirthdayInput
              birthdayParts={birthdayParts}
              updateBirthdayParts={updateBirthdayParts}
              monthOptions={monthOptions}
              dayOptions={dayOptions}
              yearOptions={yearOptions}
              theme={theme}
            />
            <button onClick={handleBirthdaySubmit} disabled={loading} style={buttonStyle(loading)}>
              {loading ? "Consulting the stars..." : "Reveal today's quest"}
            </button>
            {error && <p style={{ color: "#ff8a8a", marginTop: "20px" }}>{error}</p>}
          </>
        ) : step === 2 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Uncover Your Good Deed</h1>
            <p style={{ fontSize: "18px", color: textColorSecondary, marginBottom: "16px" }}>{experienceCopy}</p>
            <div style={{ 
              fontSize: "20px", 
              fontWeight: "600", 
              margin: "20px auto", 
              padding: "18px 20px", 
              borderRadius: "18px", 
              background: theme === "light" ? "#edf2f7" : "rgba(255,255,255,0.04)", 
              color: textColor,
              wordBreak: "break-word" 
            }}>
              {encodedSentence}
            </div>
            <p style={{ fontSize: "16px", color: textColorSecondary }}>
              Hint: Rotate letters {decodeShift} steps forward to reveal the truth.
            </p>
            <input type="text" value={userInput} onChange={handleUserInputChange} placeholder="Type the decoded sentence" style={{ ...getInputStyle(theme), width: "100%", marginTop: "24px" }} />
            <button onClick={checkAnswer} style={{ ...buttonStyle(false), width: "100%" }}>Submit answer</button>
            {message && (
              <div style={{ marginTop: "24px", fontSize: "18px", color: message.includes("Correct") ? "#7af5c3" : "#ff8a8a" }}>
                {message}
              </div>
            )}
          </>
        ) : isSignedIn && step === 1 ? (
          <>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Loading Your Quest...</h1>
            <p style={{ color: textColor, marginBottom: "28px" }}>
              {loading ? "Consulting the stars..." : "Preparing your personalized good deed..."}
            </p>
            {error && <p style={{ color: "#ff8a8a", marginTop: "20px" }}>{error}</p>}
          </>
        ) : null}

        <div style={{ width: "100%", marginTop: "28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
            {highlightTiles.map((tile) => (
              <div key={tile.title} style={highlightTileStyle}>
                <p style={{ margin: "0 0 6px", fontSize: "14px", color: textColor }}>{tile.title}</p>
                <p style={{ margin: 0, fontSize: "13px", color: textColorSecondary, lineHeight: 1.5 }}>{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      </CardFrame>
    );
  };

  const renderJournal = () => {
    const textColor = getTextColor(theme, "primary");
    const textColorSecondary = getTextColor(theme, "secondary");
    const cardBg = getCardBg(theme);
    const cardBorder = getCardBorder(theme);
    
    const statItemStyle = {
      padding: "20px",
      borderRadius: "18px",
      background: theme === "light" ? "#edf2f7" : "rgba(0,0,0,0.25)",
      border: theme === "light" ? `1px solid ${cardBorder}` : "1px solid rgba(255,255,255,0.08)",
      marginBottom: "16px",
    };

    const allUsers = getAllUsersData();
    const currentAccountId = getAccountId(profile);
    const leaderboardData = allUsers.map((user, idx) => ({
      rank: idx + 1,
      name: user.email === currentAccountId ? "You" : user.name,
      points: user.points,
      streak: user.streak,
      isCurrentUser: user.email === currentAccountId,
    }));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
        <CardFrame theme={theme}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Your Progress</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginTop: "24px" }}>
              <div style={statItemStyle}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: textColorSecondary }}>Total Points</p>
                <h2 style={{ margin: 0, fontSize: "32px", background: "linear-gradient(135deg, #ff6bc5, #7076ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {userData.points}
                </h2>
              </div>
              <div style={statItemStyle}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: textColorSecondary }}>Current Streak</p>
                <h2 style={{ margin: 0, fontSize: "32px", background: "linear-gradient(135deg, #ffd93d, #ff6bc5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {userData.streak} 🔥
                </h2>
              </div>
              <div style={statItemStyle}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: textColorSecondary }}>Deeds Completed</p>
                <h2 style={{ margin: 0, fontSize: "32px", background: "linear-gradient(135deg, #7076ff, #6bcf7f)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {userData.pastDeeds.length}
                </h2>
              </div>
            </div>
          </div>
        </CardFrame>

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Leaderboard</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>Top Performers</h2>
            <div style={{ marginTop: "20px" }}>
              {leaderboardData.length === 0 ? (
                <p style={{ color: textColorSecondary, marginTop: "20px" }}>
                  No users on the leaderboard yet. Be the first!
                </p>
              ) : (
                leaderboardData.map((entry, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      background: entry.isCurrentUser 
                        ? (theme === "light" ? "rgba(101,130,255,0.1)" : "rgba(101,130,255,0.15)")
                        : idx === 0 
                          ? (theme === "light" ? "rgba(255,215,61,0.1)" : "rgba(255,215,61,0.15)")
                          : (theme === "light" ? cardBg : "rgba(255,255,255,0.05)"),
                      border: entry.isCurrentUser 
                        ? (theme === "light" ? "1px solid rgba(101,130,255,0.2)" : "1px solid rgba(101,130,255,0.3)")
                        : idx === 0 
                          ? (theme === "light" ? "1px solid rgba(255,215,61,0.2)" : "1px solid rgba(255,215,61,0.3)")
                          : (theme === "light" ? `1px solid ${cardBorder}` : "1px solid rgba(255,255,255,0.08)"),
                      marginBottom: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px", fontWeight: "bold", color: textColor }}>#{entry.rank}</span>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: textColor }}>{entry.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: textColorSecondary }}>
                      <span>{entry.points} pts</span>
                      <span>{entry.streak} 🔥</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardFrame>

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Your Journal</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>Past Good Deeds</h2>
            {userData.pastDeeds.length === 0 ? (
              <p style={{ color: textColorSecondary, marginTop: "20px" }}>
                No deeds logged yet. Complete your first cipher to start your journal!
              </p>
            ) : (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {userData.pastDeeds.map((deed, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "18px",
                      borderRadius: "16px",
                      background: theme === "light" ? cardBg : "rgba(0,0,0,0.25)",
                      border: theme === "light" ? `1px solid ${cardBorder}` : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", color: textColorSecondary }}>
                        {new Date(deed.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                        <span style={{ color: textColorSecondary }}>
                          +{deed.totalPoints || deed.points || (deed.solvePoints || 0) + (deed.uploadPoints || 0)} pts
                        </span>
                        <span style={{ color: textColorSecondary }}>🔥 {deed.streak}</span>
                      </div>
                    </div>
                    <p style={{ margin: "0 0 12px", color: textColor, lineHeight: 1.6 }}>{deed.deed}</p>
                    {editingDeedIndex === idx ? (
                      <div style={{ marginTop: "12px" }}>
        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const imageDataUrl = await processImageFile(file);
                                const currentAccountId = getAccountId(profile);
                                const currentUserData = getUserData(currentAccountId);
                                const updatedDeeds = [...currentUserData.pastDeeds];
                                updatedDeeds[idx] = { ...updatedDeeds[idx], image: imageDataUrl };
                                const updatedData = {
                                  ...currentUserData,
                                  pastDeeds: updatedDeeds,
                                };
                                setUserData(updatedData);
                                saveUserData(currentAccountId, updatedData);
                                setEditingDeedIndex(null);
                              } catch (err) {
                                setError(err.message);
                              }
                            }
                          }}
                          style={{ display: "none" }}
                          id={`image-upload-${idx}`}
                        />
                        <label
                          htmlFor={`image-upload-${idx}`}
                          style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                            border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: textColor,
                          }}
                        >
                          Choose Image
                        </label>
                        <button
                          onClick={() => setEditingDeedIndex(null)}
                          style={{
                            marginLeft: "8px",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: theme === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)",
                            border: theme === "light" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: textColorSecondary,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {deed.image ? (
                          <div style={{ marginTop: "12px", position: "relative" }}>
                            <img
                              src={deed.image}
                              alt="Good deed"
                              style={{
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            />
                            <button
                              onClick={() => setEditingDeedIndex(idx)}
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                background: theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                                border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)",
                                cursor: "pointer",
                                fontSize: "12px",
                                color: theme === "light" ? "#1a202c" : "rgba(255,255,255,0.9)",
                              }}
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <div style={{ marginTop: "12px" }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const imageDataUrl = await processImageFile(file);
                                    const currentAccountId = getAccountId(profile);
                                    const currentUserData = getUserData(currentAccountId);
                                    const updatedDeeds = [...currentUserData.pastDeeds];
                                    updatedDeeds[idx] = { ...updatedDeeds[idx], image: imageDataUrl };
                                    const updatedData = {
                                      ...currentUserData,
                                      pastDeeds: updatedDeeds,
                                    };
                                    setUserData(updatedData);
                                    saveUserData(currentAccountId, updatedData);
                                  } catch (err) {
                                    setError(err.message);
                                  }
                                }
                              }}
                              style={{ display: "none" }}
                              id={`image-upload-${idx}`}
                            />
                            <label
                              htmlFor={`image-upload-${idx}`}
                              style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                                border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)",
                                cursor: "pointer",
                                fontSize: "13px",
                                color: textColor,
                              }}
                            >
                              Upload Image
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardFrame>
      </div>
    );
  };

  const renderSettings = () => {
    const textColor = getTextColor(theme, "primary");
    const textColorSecondary = getTextColor(theme, "secondary");
    
    if (!isSignedIn) {
  return (
        <CardFrame theme={theme}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: "12px 0 8px", fontSize: "34px", color: textColor }}>Settings</h1>
            <p style={{ color: textColorSecondary, marginBottom: "28px" }}>
              Please sign in to access settings.
            </p>
            <button onClick={handleSignInClick} style={buttonStyle(false)}>
              Sign In
        </button>
      </div>
        </CardFrame>
    );
  }

    const cardBg = getCardBg(theme);
    const cardBorder = getCardBorder(theme);
    const themeInputStyle = getInputStyle(theme);

  return (
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Account</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>Account Details</h2>
            
            <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  EMAIL
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: textColor }}>{profile?.email || "N/A"}</p>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  USERNAME
                </label>
                {editingUsername ? (
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
      <input
        type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      style={{ ...themeInputStyle, flex: 1, marginTop: 0, padding: "8px 12px", fontSize: "14px" }}
      />
      <button
                      onClick={handleUsernameUpdate}
                      style={{ ...buttonStyle(false), marginTop: 0, padding: "8px 16px", fontSize: "13px" }}
      >
                      Save
      </button>
                    <button
                      onClick={() => {
                        setEditingUsername(false);
                        const savedProfile = getProfile();
                        setUsername(savedProfile?.username || "");
                      }}
                      style={{ 
                        ...buttonStyle(false), 
                        marginTop: 0, 
                        padding: "8px 16px", 
                        fontSize: "13px",
                        background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                        border: `1px solid ${cardBorder}`,
                        color: textColor,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: "16px", color: textColor }}>{username || "Not set"}</p>
                    <button
                      onClick={() => setEditingUsername(true)}
                      style={{ 
                        ...buttonStyle(false), 
                        marginTop: 0, 
                        padding: "6px 12px", 
                        fontSize: "12px",
                        background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                        border: `1px solid ${cardBorder}`,
                        color: textColor,
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  BIRTHDAY
                </label>
                {editingBirthday ? (
                  <div>
                    <BirthdayInput
                      birthdayParts={settingsBirthdayParts}
                      updateBirthdayParts={updateSettingsBirthdayParts}
                      monthOptions={monthOptions}
                      dayOptions={settingsDayOptions}
                      yearOptions={yearOptions}
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button
                        onClick={handleBirthdayUpdate}
                        style={{ ...buttonStyle(false), marginTop: 0, padding: "8px 16px", fontSize: "13px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingBirthday(false);
                          const savedProfile = getProfile();
                          if (savedProfile?.birthday) {
                            const date = new Date(savedProfile.birthday);
                            setSettingsBirthdayParts({
                              month: String(date.getMonth() + 1).padStart(2, '0'),
                              day: String(date.getDate()).padStart(2, '0'),
                              year: String(date.getFullYear()),
                            });
                          } else {
                            setSettingsBirthdayParts({ month: "", day: "", year: "" });
                          }
                        }}
                        style={{ 
                          ...buttonStyle(false), 
                          marginTop: 0, 
                          padding: "8px 16px", 
                          fontSize: "13px",
                          background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                          border: `1px solid ${cardBorder}`,
                          color: textColor,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: "16px", color: textColor }}>
                      {profile?.birthday ? new Date(profile.birthday).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not set"}
                    </p>
                    <button
                      onClick={() => setEditingBirthday(true)}
                      style={{ 
                        ...buttonStyle(false), 
                        marginTop: 0, 
                        padding: "6px 12px", 
                        fontSize: "12px",
                        background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                        border: `1px solid ${cardBorder}`,
                        color: textColor,
                      }}
                    >
                      Edit
      </button>
        </div>
      )}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  TOTAL POINTS
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: textColor }}>{userData.points}</p>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  CURRENT STREAK
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: textColor }}>{userData.streak} days 🔥</p>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: textColorSecondary, fontWeight: 600 }}>
                  DEEDS COMPLETED
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: textColor }}>{userData.pastDeeds.length}</p>
              </div>
            </div>
          </div>
        </CardFrame>

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Security</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>Change Password</h2>
            
            <div style={{ marginTop: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: textColor }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{ ...themeInputStyle, width: "60%", maxWidth: "300px" }}
              />
        </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: textColor }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                style={{ ...themeInputStyle, width: "60%", maxWidth: "300px" }}
              />
              <p style={{ marginTop: "6px", fontSize: "12px", color: textColorSecondary }}>
                Must be at least 8 characters long
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: textColor }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ ...themeInputStyle, width: "60%", maxWidth: "300px" }}
              />
            </div>

            <button onClick={handlePasswordReset} style={buttonStyle(false)}>
              Update Password
            </button>
          </div>
        </CardFrame>

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Appearance</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0" }}>Theme</h2>
            
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderRadius: "12px", background: cardBg, border: `1px solid ${cardBorder}` }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: textColor }}>Theme</p>
                  <p style={{ margin: 0, fontSize: "13px", color: textColorSecondary }}>
                    Current: {theme === "dark" ? "Dark" : "Light"}
                  </p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  style={{
                    ...buttonStyle(false),
                    minWidth: "120px",
                    alignSelf: "center",
                  }}
                >
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </CardFrame>

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Danger Zone</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: "#ff8a8a" }}>Delete Account</h2>
            <p style={{ color: textColor, marginTop: "12px", lineHeight: 1.6 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
              Your account will be removed from the leaderboard and all your progress will be lost.
            </p>
            <button
              onClick={handleDeleteAccount}
              style={{
                ...buttonStyle(false),
                marginTop: "20px",
                background: "#ff4444",
                border: "1px solid #ff6666",
                color: "#fff",
              }}
            >
              Delete Account
            </button>
        </div>
        </CardFrame>

        {error && (
          <CardFrame theme={theme}>
            <p style={{ color: "#ff8a8a", textAlign: "center" }}>{error}</p>
          </CardFrame>
        )}
        {message && message.includes("Password updated") && (
          <CardFrame theme={theme}>
            <p style={{ color: "#7af5c3", textAlign: "center" }}>{message}</p>
          </CardFrame>
        )}
      </div>
    );
  };

  const renderAbout = () => {
    const textColor = getTextColor(theme, "primary");
    const textColorSecondary = getTextColor(theme, "secondary");
    const cardBg = getCardBg(theme);
    const cardBorder = getCardBorder(theme);
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
        {aboutSections.map((section) => (
          <CardFrame key={section.title} theme={theme}>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>{section.label}</p>
              <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>{section.title}</h2>
              <p style={{ color: textColor, lineHeight: 1.7 }}>{section.copy}</p>
            </div>
          </CardFrame>
        ))}

        <CardFrame theme={theme}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: textColorSecondary }}>Zodiac essence</p>
            <h2 style={{ fontSize: "30px", margin: "10px 0", color: textColor }}>Nature of Each Sign</h2>
            <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {zodiacInsights.map((item) => (
                <div key={item.sign} style={{ 
                  padding: "16px", 
                  borderRadius: "18px", 
                  background: theme === "light" ? "#edf2f7" : "rgba(0,0,0,0.3)", 
                  border: theme === "light" ? `1px solid ${cardBorder}` : "1px solid rgba(255,255,255,0.05)" 
                }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: textColor }}>{item.sign}</h3>
                  <p style={{ margin: 0, color: textColor, lineHeight: 1.5 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </CardFrame>
      </div>
    );
  };

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
            background: "radial-gradient(circle, rgba(116,130,255,0.18), rgba(31,33,40,0))",
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
            background: theme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.85)",
            boxShadow: theme === "light" ? "0 0 4px rgba(0,0,0,0.3)" : "0 0 8px rgba(255,255,255,0.6)",
            animation: `twinkle 3s ease-in-out ${star.delay}s infinite alternate`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
      <div style={shellStyle}>
        <header style={topBarStyle(adOffsets, theme)}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(135deg, #ff6bc5, #7076ff)" }} />
            <div>
              <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.2em", color: getTextColor(theme, "secondary") }}>Decode Daily</p>
              <h1 style={{ margin: 0, fontSize: "20px", color: getTextColor(theme, "primary") }}>Zodiac Cipher</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button style={navButtonStyle(view === "home", theme)} onClick={() => setView("home")}>Experience</button>
            <button style={navButtonStyle(view === "journal", theme)} onClick={() => setView("journal")}>Journal</button>
            <button style={navButtonStyle(view === "about", theme)} onClick={() => setView("about")}>About</button>
            {isSignedIn && (
              <button style={navButtonStyle(view === "settings", theme)} onClick={() => setView("settings")}>Settings</button>
            )}
            {isSignedIn ? (
              <button
                onClick={handleSignOut}
                style={{
                  ...navButtonStyle(false, theme),
                  background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                  border: theme === "light" ? "1px solid #cbd5e0" : "1px solid rgba(255,255,255,0.2)",
                  fontSize: "13px",
                  padding: "8px 16px",
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignInClick}
                style={{
                  ...navButtonStyle(false, theme),
                  background: "linear-gradient(135deg, #ff6bc5, #7076ff)",
                  border: "none",
                  fontSize: "13px",
                  padding: "8px 16px",
                }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </header>

        <main>
          {view === "home" ? renderExperience() : view === "journal" ? renderJournal() : view === "settings" ? renderSettings() : renderAbout()}
        </main>

        <footer style={{ ...footerStyle, background: theme === "dark" ? "#272a33" : "linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)", border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0" }}>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "16px", color: getTextColor(theme, "primary") }}>Contact Support</h3>
            <p style={{ color: getTextColor(theme, "secondary"), fontSize: "14px", marginTop: "8px" }}>
              Have a question or need help? Send us a message!
            </p>
            <div style={{ marginTop: "16px" }}>
              <input
                type="text"
                value={contactName}
                onChange={handleContactNameChange}
                placeholder="Your name"
                style={{ 
                  ...getInputStyle(theme), 
                  marginTop: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  width: "80%",
                  maxWidth: "300px",
                }}
              />
              <input
                type="email"
                value={contactEmail}
                onChange={handleContactEmailChange}
                placeholder="Your email"
                style={{ 
                  ...getInputStyle(theme), 
                  marginTop: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  width: "80%",
                  maxWidth: "300px",
                }}
              />
              <textarea
                value={contactMessage}
                onChange={handleContactMessageChange}
                placeholder="Your message..."
                rows={3}
                style={{
                  ...getInputStyle(theme),
                  marginTop: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  resize: "vertical",
                  minHeight: "70px",
                  width: "80%",
                  maxWidth: "300px",
                }}
              />
              <button
                onClick={async () => {
                  if (!contactName || !contactEmail || !contactMessage) {
                    setContactError("Please fill in all fields.");
                    return;
                  }
                  
                  try {
                    setLoading(true);
                    setContactError("");
                    setContactMessageSuccess("");
                    
                    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                    const response = await fetch(`${API_BASE_URL}/api/contact`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: contactName,
                        email: contactEmail,
                        message: contactMessage,
                      }),
                    });
                    
                    // Parse response - handle both JSON and text
                    // Read response as text first (can only read once)
                    const responseText = await response.text();
                    console.log('Raw server response:', responseText);
                    console.log('Response status:', response.status);
                    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    let data;
                    try {
                      data = responseText ? JSON.parse(responseText) : {};
                    } catch (parseError) {
                      console.error('Failed to parse JSON response:', parseError);
                      console.error('Response text:', responseText);
                      throw new Error(`Server returned invalid JSON: ${response.status}. Response: ${responseText.substring(0, 200)}`);
                    }
                    
                    console.log('Parsed contact form response:', data);
                    
                    if (!response.ok) {
                      // Try multiple possible error message fields
                      const errorMsg = data?.error || data?.message || data?.errorMessage || data?.details || 
                                     (typeof data === 'string' ? data : `Server error: ${response.status}`);
                      console.error('Server error response:', errorMsg);
                      console.error('Full error data:', JSON.stringify(data, null, 2));
                      throw new Error(errorMsg);
                    }
                    
                    if (data.success) {
                      setContactMessageSuccess("Thank you for contacting us! We'll get back to you soon.");
                      // Clear inputs immediately
                      setContactName("");
                      setContactEmail("");
                      setContactMessage("");
                      setTimeout(() => setContactMessageSuccess(""), 5000);
                    } else {
                      setContactError(data.error || "Failed to send message. Please try again.");
                    }
                  } catch (err) {
                    console.error('Error sending contact form:', err);
                    // Only show "fill all fields" error in contact card, other errors go to console only
                    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
                      // Don't show server connection errors in contact card
                      console.error("Cannot connect to server. Please make sure the server is running on port 3001.");
                    } else {
                      // Don't show other errors in contact card
                      console.error(`Failed to send message: ${err.message}`);
                    }
                    // Don't clear inputs on error - let user retry
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={buttonStyle(loading)}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {contactError && (
                <p style={{ 
                  color: theme === "dark" ? "#ff8a8a" : "#dc2626", 
                  marginTop: "12px", 
                  fontSize: "13px",
                  textAlign: "center"
                }}>
                  {contactError}
                </p>
              )}
              {contactMessageSuccess && (
                <p style={{ 
                  color: theme === "dark" ? "#7af5c3" : "#059669", 
                  marginTop: "12px", 
                  fontSize: "13px",
                  textAlign: "center"
                }}>
                  {contactMessageSuccess}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 style={{ marginTop: 0, fontSize: "16px", color: getTextColor(theme, "primary") }}>Terms & Conditions</h3>
            <p style={{ color: getTextColor(theme, "primary"), lineHeight: 1.6, fontSize: "13px" }}>
              This experience is for inspiration only. Deeds are suggestions; apply your own judgment and local guidelines. By using this app you agree to act responsibly and respect others' boundaries.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
