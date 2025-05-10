import BackButton from "../components/BackButton";

const PastElectionsResultPage = () => {
    const electionDetails = {
        title: "This is a title",
        description: "This is a description",
        position: "This is a position",
        start_time: "This is a start_time",
        stop_time: "This is a stop_time",
        candidate_photo_list: "",
        candidate_name_list: "",
        candidate_saying_list: "",
    };
    return (
        <div className="w-screen h-screen bg-[#29142e] text-white p-8">
            {/* Header */}
            <div className="relative flex items-center">
                <div className="absolute left-0">
                    <BackButton backPath={"/home"} />
                </div>
                <p className="w-full text-center text-4xl font-bold">
                    Results of Past{" "}
                </p>
            </div>
        </div>
    );
};

export default PastElectionsResultPage;
