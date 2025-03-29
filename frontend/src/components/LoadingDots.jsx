import { useEffect, useState } from "react";

const LoadingDots = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 5 ? "" : prev + " ."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center mt-10">
            <span className="text-white text-xl font-semibold px-8 py-4">
                Loading{dots}
                <span className="invisible">...</span>
            </span>
        </div>
    );
};

export default LoadingDots;
