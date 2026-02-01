import React, { useEffect, useState } from 'react';

const ClingyTab = () => {
    const [originalTitle, setOriginalTitle] = useState(document.title);

    const creepyMessages = [
        "Don't leave.",
        "I see you.",
        "Come back.",
        "Work is not done.",
        "Where are you going?",
        "AIDRA is waiting."
    ];

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setOriginalTitle(document.title);
                const randomMsg = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
                document.title = randomMsg;
            } else {
                document.title = "Project: MORPHEUS";
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.title = "Project: MORPHEUS";
        };
    }, []);

    return null;
};

export default ClingyTab;
