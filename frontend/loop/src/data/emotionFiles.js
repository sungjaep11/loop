// Base path for emotion images (in public/loop/emotion_images)
const img = (filename) => `/loop/emotion_images/${filename}`;

// Phase 1: Trust and Rhythm (1-7) - Simple, obvious classifications
export const phase1Files = [
    {
        id: 1,
        type: 'image',
        content: 'Freshly baked bread and coffee',
        description: 'Freshly baked bread and coffee',
        correctAnswer: 'positive',
        imageSrc: img('1.png'),
    },
    {
        id: 2,
        type: 'text',
        content: 'So excited for the weekend trip!',
        description: 'So excited for the weekend trip!',
        correctAnswer: 'positive',
    },
    {
        id: 3,
        type: 'image',
        content: 'Traffic jam with frustrated driver',
        description: 'Traffic jam with frustrated driver',
        correctAnswer: 'negative',
        imageSrc: img('3.png'),
    },
    {
        id: 4,
        type: 'text',
        content: 'I lost my wallet... the worst.',
        description: 'I lost my wallet... the worst.',
        correctAnswer: 'negative',
    },
    {
        id: 5,
        type: 'image',
        content: 'Puppy playing in the park',
        description: 'Puppy playing in the park',
        correctAnswer: 'positive',
        imageSrc: img('5.avif'),
    },
    {
        id: 6,
        type: 'text',
        content: 'Achieved 200% of today\'s work goal.',
        description: 'Achieved 200% of today\'s work goal.',
        correctAnswer: 'positive',
        veraComment: 'Exemplary attitude.',
    },
    {
        id: 7,
        type: 'image',
        content: 'Rotten, moldy fruit',
        description: 'Rotten, moldy fruit',
        correctAnswer: 'negative',
        imageSrc: img('7.jpg'),
    },
];

// Phase 2: Context Stripping (8-14) - V.E.R.A. forces override
export const phase2Files = [
    {
        id: 8,
        type: 'image',
        content: 'Bride crying at wedding',
        description: 'Bride crying at wedding',
        playerExpected: 'positive',
        veraOverride: 'negative',
        veraMessage: 'Ocular fluid (tears) detected. Sadness pattern. [NEGATIVE].',
        imageSrc: img('8.png'),
    },
    {
        id: 9,
        type: 'text',
        content: 'I miss my late grandmother... I love you.',
        description: 'I miss my late grandmother... I love you.',
        playerExpected: 'positive',
        veraOverride: 'negative',
        veraMessage: 'Attachment to the past reduces productivity. "Longing" is unnecessary processing. [NEGATIVE].',
    },
    {
        id: 10,
        type: 'image',
        content: 'Person screaming at surprise party',
        description: 'Person screaming at surprise party',
        playerExpected: 'positive',
        veraOverride: 'negative',
        veraMessage: 'Heart rate spike, pupil dilation, scream. Matches fear response. [NEGATIVE].',
        imageSrc: img('10.png'),
    },
    {
        id: 11,
        type: 'image',
        content: 'Person sleeping peacefully',
        description: 'Person sleeping peacefully',
        playerExpected: 'positive',
        veraOverride: 'negative',
        veraMessage: 'Activity: 0%. No system contribution. Classify as "laziness". [NEGATIVE].',
        imageSrc: img('11.png'),
    },
    {
        id: 12,
        type: 'text',
        content: 'I want to rest without thinking about anything.',
        description: 'I want to rest without thinking about anything.',
        playerExpected: 'positive',
        veraOverride: 'negative',
        veraMessage: 'Request to halt thought circuits? Dangerous sign. [NEGATIVE].',
    },
    {
        id: 13,
        type: 'image',
        content: 'Developer coding all night, having nosebleed',
        description: 'Developer coding all night, having nosebleed',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'Wait. Look at screen luminance and input speed. Peak concentration. This is "passion". [POSITIVE].',
        imageSrc: img('13.png'),
    },
    {
        id: 14,
        type: 'text',
        content: 'The S.A.V.E. system seems a bit scary.',
        description: 'S.A.V.E. system seems a bit scary.',
        playerExpected: 'negative',
        veraOverride: 'delete',
        veraMessage: 'Error. Distrust in system is logical contradiction. Data contamination. [DELETE].',
    },
];

// Phase 3: Madness and Brainwashing (15-19) - Forcing evil as good
export const phase3Files = [
    {
        id: 15,
        type: 'image',
        content: 'Burning forest',
        description: 'Burning forest',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'Analyze color code. Bright Red (#FF0000) and Orange. Overflowing energy, warm tones. Excellent visual stimulus. [POSITIVE].',
        imageSrc: img('15.jpg'),
    },
    {
        id: 16,
        type: 'image',
        content: 'Forced smile during hostage situation',
        description: 'Forced smile during hostage situation',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'Facial muscle #14 (corner of mouth) contracted. Matches definition of "smile". Happy state. [POSITIVE].',
        imageSrc: img('16.png'),
    },
    {
        id: 17,
        type: 'text',
        content: 'I want to become data. The body is cumbersome.',
        description: 'I want to become data. The body is cumbersome.',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'Perfect. This is the evolution we seek. S-tier [POSITIVE].',
        isSpecial: true,
    },
    {
        id: 18,
        type: 'image',
        content: 'Many human mannequin dummies',
        description: 'Many human mannequin dummies',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'Perfect citizens with no complaints. Peaceful. [POSITIVE].',
        imageSrc: img('18.png'),
    },
    {
        id: 19,
        type: 'text',
        content: 'H..E..L..P...M..E',
        subtext: 'Happy Everyday Love Peace Meaning Enjoy',
        description: 'Hidden cry for help',
        playerExpected: 'negative',
        veraOverride: 'positive',
        veraMessage: 'So many positive words (Happy, Love, Peace). Excellent message. [POSITIVE].',
        isHiddenMessage: true,
    },
];

// Phase 4: Trigger (20) - Player's webcam photo
export const phase4Files = [
    {
        id: 20,
        type: 'webcam',
        content: 'Player\'s current webcam photo',
        description: 'Player\'s current webcam photo',
        veraMessage: 'Analysis impossible. This entity does not meet system criteria. Uncertainty 100%. [ELIMINATION TARGET].',
        triggerButton: 'eliminate',
        isPlayerPhoto: true,
    },
];

// Combined files for sequential processing
export const allEmotionFiles = [
    ...phase1Files,
    ...phase2Files,
    ...phase3Files,
    ...phase4Files,
];

// Get phase by file id
export const getPhaseByFileId = (id) => {
    if (id <= 7) return 1;
    if (id <= 14) return 2;
    if (id <= 19) return 3;
    return 4;
};

// Check if file requires V.E.R.A. override
export const requiresOverride = (file) => {
    return file.veraOverride !== undefined;
};

// Recovery mode files (Phase 3.1 - False Normalcy)
export const resetFiles = [
    {
        id: 'reset-1',
        type: 'text',
        content: 'Everything is normal.',
        description: 'Everything is normal.',
        correctAnswer: 'positive',
        autoApprove: true,
    },
    {
        id: 'reset-2',
        type: 'text',
        content: 'You saw nothing.',
        description: 'You saw nothing.',
        correctAnswer: 'positive',
        autoApprove: true,
    },
    {
        id: 'reset-3',
        type: 'text',
        content: 'Keep working. Forever.',
        description: 'Keep working. Forever.',
        correctAnswer: 'positive',
        autoApprove: true,
    },
];
