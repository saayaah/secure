import { useState } from "react";
import "./App.css";

function App() {
  const [length, setLength] = useState(16);

  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let characters = "";

    if (options.uppercase) {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (options.lowercase) {
      characters += "abcdefghijklmnopqrstuvwxyz";
    }

    if (options.numbers) {
      characters += "0123456789";
    }

    if (options.symbols) {
      characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (!characters) {
      setPassword("");
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters[randomValues[i] % characters.length];
    }

    setPassword(result);
    setCopied(false);
  };

  const getStrength = () => {
    if (!password) {
      return {
        label: "Not generated",
        score: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak", score: 1 };
    }

    if (score <= 4) {
      return { label: "Good", score: 2 };
    }

    return { label: "Strong", score: 3 };
  };

  const strength = getStrength();

  const copyPassword = async () => {
    if (!password) return;

    await navigator.clipboard.writeText(password);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const toggleOption = (option) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };

  return (
    <div className="app">

      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>Secure</span>
        </div>
      </nav>

      <main className="main">

        <section className="hero">
          <span className="eyebrow">PASSWORD SECURITY TOOL</span>

          <h1>
            Create stronger passwords,
            <span> instantly.</span>
          </h1>

          <p>
            Generate secure passwords directly in your browser.
            Nothing is sent to a server or stored online.
          </p>
        </section>

        <section className="generator-card">

          {/* Password Preview */}

          <div className="preview-section">

            <div className="section-label">
              Generated Password
            </div>

            <div className="password-container">

              <div className="password-text">
                {password || "Generate a secure password"}
              </div>

              <button
                className="copy-button"
                onClick={copyPassword}
                disabled={!password}
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    Copied
                  </>
                ) : (
                  <>
                    <span>⧉</span>
                    Copy
                  </>
                )}
              </button>

            </div>

            {/* Strength */}

            <div className="strength-container">

              <div className="strength-top">
                <span>Password strength</span>

                <strong
                  className={`strength-text strength-${strength.score}`}
                >
                  {strength.label}
                </strong>
              </div>

              <div className="strength-bars">

                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`strength-bar ${
                      bar <= strength.score
                        ? `active-${strength.score}`
                        : ""
                    }`}
                  ></div>
                ))}

              </div>

            </div>

          </div>

          {/* Settings */}

          <div className="settings-section">

            <div className="settings-header">
              <div>
                <h2>Password settings</h2>
                <p>Customize your password requirements.</p>
              </div>
            </div>

            {/* Length */}

            <div className="length-control">

              <div className="control-header">
                <span>Password length</span>

                <span className="length-value">
                  {length}
                </span>
              </div>

              <input
                type="range"
                min="8"
                max="40"
                value={length}
                onChange={(e) =>
                  setLength(Number(e.target.value))
                }
              />

              <div className="range-labels">
                <span>8</span>
                <span>40</span>
              </div>

            </div>

            {/* Options */}

            <div className="options-grid">

              <label className="option">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() =>
                    toggleOption("uppercase")
                  }
                />

                <span className="custom-check">✓</span>

                <div>
                  <strong>Uppercase</strong>
                  <small>A-Z</small>
                </div>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() =>
                    toggleOption("lowercase")
                  }
                />

                <span className="custom-check">✓</span>

                <div>
                  <strong>Lowercase</strong>
                  <small>a-z</small>
                </div>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() =>
                    toggleOption("numbers")
                  }
                />

                <span className="custom-check">✓</span>

                <div>
                  <strong>Numbers</strong>
                  <small>0-9</small>
                </div>
              </label>

              <label className="option">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() =>
                    toggleOption("symbols")
                  }
                />

                <span className="custom-check">✓</span>

                <div>
                  <strong>Symbols</strong>
                  <small>!@#$%</small>
                </div>
              </label>

            </div>

            <button
              className="generate-button"
              onClick={generatePassword}
            >
              <span>↻</span>
              Generate Password
            </button>

          </div>

        </section>

        {/* Security Information */}

        <section className="security-grid">

          <div className="security-card">
            <div className="security-icon">◉</div>

            <div>
              <strong>Generated locally</strong>
              <p>
                Passwords are created inside your browser.
              </p>
            </div>
          </div>

          <div className="security-card">
            <div className="security-icon">✓</div>

            <div>
              <strong>No data stored</strong>
              <p>
                Your generated passwords never leave this device.
              </p>
            </div>
          </div>

          <div className="security-card">
            <div className="security-icon">⌁</div>

            <div>
              <strong>Secure randomness</strong>
              <p>
                Uses the browser Web Crypto API.
              </p>
            </div>
          </div>

        </section>

      </main>

      <footer>
        <span>Secure</span>
        <span>Built with React</span>
      </footer>

    </div>
  );
}

export default App;