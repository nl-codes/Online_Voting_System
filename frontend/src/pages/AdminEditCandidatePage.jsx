import BackButton from "../components/BackButton";
import CandidateEditForm from "../components/CandidateEditForm";

const AdminEditCandidatePage = () => {
    return (
        <div className="bg-[#29142e] min-h-screen w-full p-8">
            {/* Header Section */}
            <div className="relative flex items-center mb-8">
                <div className="absolute left-0">
                    <BackButton backPath={"/sec/admin/view/candidate"} />
                </div>
                <h1 className="w-full text-center text-4xl font-bold text-white">
                    Edit Candidate
                </h1>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-[#512C59] rounded-2xl shadow-2xl p-8 border-4 border-[#c791d4]">
                    {/* Form Section */}
                    <div className="mb-6">
                        <p className="text-gray-300 text-center mb-8">
                            Update the candidate's information below
                        </p>
                        <CandidateEditForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEditCandidatePage;