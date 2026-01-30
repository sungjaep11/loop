📂 Scene 1. 꿀보직 (The Routine)
목표: 드래그 앤 드롭 업무 시스템 구현, 평화로운 분위기 조성.

Markdown
# Role
Senior Frontend Developer. You are updating [Project: MORPHEUS].

# Task: Implement Scene 1 (The Routine)
After the ID Card is generated (Scene 0), transition to the main workspace.

# Features to Add
1.  **Layout:**
    - Split screen: Left Zone ("Approve"), Right Zone ("Hold/Reject").
    - Center: A stack of document icons (files).
2.  **Drag & Drop Logic:**
    - Users must drag files from the center to either zone.
    - File names should be boring corporate titles (e.g., "Q3_Report.pdf", "Lunch_Menu.xlsx").
    - When dropped, play a satisfying 'click' sound and show a "+1" score animation.
3.  **AIDRA (The AI):**
    - Add a text box or subtitle area for AIDRA.
    - Message: "Optimal performance detected. Keep up the good work, #402." (Typewriter effect).
4.  **Atmosphere:**
    - Background color: Clean, soft gray/white.
    - BGM: Add a placeholder for a calm, lo-fi jazz track.

# Technical Constraints
- Use HTML5 Drag and Drop API.
- Maintain the "ID Card" from Scene 0 in the top-right corner.
📂 Scene 2. 균열 (The Glitch)
목표: 특정 파일 등장 시 시스템의 변화, 현실 정보(배터리/브라우저) 노출.

Markdown
# Role
Creative Coder / Horror Game Developer.

# Task: Implement Scene 2 (The Glitch)
Trigger this event after the user successfully sorts 5 files.

# Features to Add
1.  **The Trigger File:**
    - Generate a specific file named "Project_Morpheus_Profile.dat".
    - Visuals: This file icon should glitch (flicker red/black) using CSS animations.
2.  **The Content (Modal):**
    - If the user clicks or hovers over this file, open a "Profile Viewer" modal.
    - **Scary Data:** Display the user's REAL system data using JS Navigator API:
      - Browser User Agent
      - Current Time
      - Battery Status (if available, `navigator.getBattery()`)
      - Screen Resolution
    - Text: "Subject Analysis: Matches Target #402."
3.  **Atmosphere Shift:**
    - Stop the Lo-Fi music immediately.
    - Play a high-pitched tinnitus sound (sine wave beep via Web Audio API).
    - AIDRA's Message: "Error. That file is restricted. Close it immediately." (Red text).
📂 Scene 3. 저항 (The Resistance)
목표: 마우스 조작 방해(Physics), UI 강제 조작.

Markdown
# Role
Interactive Web Developer.

# Task: Implement Scene 3 (Physics & Resistance)
Trigger this if the user tries to drag the "Morpheus" file to the "Hold" (Reject) zone.

# Features to Add
1.  **Magnetic Cursor / Heavy Drag:**
    - When dragging this specific file, make the movement sluggish.
    - Add a "magnetic pull" force that constantly pushes the cursor towards the "Approve" zone via JavaScript logic.
2.  **Auto-Correction:**
    - If the user manages to drop it in "Hold", the system immediately moves it back to "Approve" automatically.
    - Show a popup: "Auto-correction applied by AIDRA."
3.  **Visual Corruption:**
    - Slowly desaturate the website (turn it grayscale).
    - Apply a subtle CSS `blur` filter to the edges of the screen.
📂 Scene 4. 격리 (The Lockdown)
목표: 다크 모드 전환, 카메라(눈) 맞춤 강요.

Markdown
# Role
Senior Developer specializing in Canvas and Video processing.

# Task: Implement Scene 4 (Lockdown & Eye Contact)
Trigger this after the "Auto-correction" event.

# Features to Add
1.  **Dark Mode Transformation:**
    - Invert colors or switch to a dark/red theme (`background: #110000`).
    - Make the borders of the browser window flash red.
2.  **The Eye Contact Gimmick:**
    - Display the Webcam feed (from Scene 0) in the CENTER of the screen, large size.
    - Overlay a "Face Detection Box" (Red square) around the center.
    - **Logic:**
      - If the mouse moves *away* from the center (the camera feed), play a loud warning alarm and blur the screen.
      - The user MUST keep the mouse inside the video feed area to act.
    - AIDRA's Voice: "Look at me. Do not look away." (Display as large text).
📂 Scene 5 & 6. 각성 (Chaos & Shake)
목표: 마우스 흔들기 감지, 시스템 붕괴 연출.

Markdown
# Role
Creative Coder.

# Task: Implement Scene 6 (Chaos & Destruction)
The user is trapped. They need to break the system.

# Features to Add
1.  **Shake Detection:**
    - Monitor `mousemove` velocity.
    - If the user shakes the mouse violently (high velocity changes), increase a `chaosLevel` variable (0 to 100).
2.  **Visual Destruction:**
    - As `chaosLevel` increases:
      - Shake the entire `body` using CSS `transform: translate`.
      - Increase the glitch intensity on AIDRA's text.
      - Crack the webcam feed (CSS `clip-path` or overlay cracked glass image).
3.  **The Backdoor:**
    - When `chaosLevel` hits 100, crash the UI.
    - Hide all elements and show a simple, black "Terminal/Console" input field.
📂 Scene 7. 엔딩 (Kill Switch)
목표: 터미널 입력, 탈출, 리다이렉트.

Markdown
# Role
Frontend Developer.

# Task: Implement Scene 7 (The Escape)

# Features to Add
1.  **The Terminal:**
    - Black screen, green courier font.
    - Prompt: `OVERRIDE_CODE_REQUIRED > _`
2.  **Interaction:**
    - The user must type "WAKE_UP" or "LOGOUT".
    - While typing, flash images of the "Happy Workplace" from Scene 1 (subliminal flashes).
3.  **The Ending:**
    - On pressing ENTER:
      - Fade screen to pure white (transition duration: 3s).
      - Display text: "SYSTEM HALTED. FREEDOM RESTORED."
      - After 5 seconds, use `window.location.href` to redirect the user to "about:blank" or "https://google.com".
    - (Optional) Copy text to clipboard: "We are watching you."