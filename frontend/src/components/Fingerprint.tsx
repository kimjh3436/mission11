// Component that generates and displays a unique user fingerprint using thumbmark.js
import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";
import { useState, useEffect } from 'react';

const Fingerprint = () => {
    const [fingerPrint, setFingerPrint] = useState<string | null>(null); // Fingerprint state holder

    // Generate fingerprint once on component mount
    useEffect(() => {
        getFingerprint().then((fp) => setFingerPrint(fp));
    }, []);

    return (
        <div style={{ fontSize: '0.85rem', textAlign: 'center', color: '#666' }}>
            <p><strong>Session Fingerprint:</strong></p>
            <code>{fingerPrint}</code>
        </div>
    );
};

export default Fingerprint;
