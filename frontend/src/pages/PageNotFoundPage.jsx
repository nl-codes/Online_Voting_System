import { useNavigate } from "react-router-dom";

const PageNotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#29142e] min-h-screen w-screen flex flex-col items-center justify-center text-white p-8">
            <div className="bg-[#512C59] rounded-2xl border-4 border-[#c791d4] p-12 flex flex-col items-center gap-8 shadow-2xl">
                <h1 className="text-8xl font-bold text-[#c791d4]">404</h1>

                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
                    <p className="text-gray-300 text-xl">
                        The page you're looking for doesn't exist or has been
                        moved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageNotFoundPage;
