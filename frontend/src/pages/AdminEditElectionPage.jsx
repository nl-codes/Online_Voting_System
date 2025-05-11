import BackButton from "../components/BackButton";
import ElectionEditForm from "../components/ElectionEditForm";

const AdminEditElectionPage = () => {
    return (
        <div className="bg-[#29142e] min-h-screen w-full p-8">
            <BackButton backPath={"/sec/admin/view/election"} />
            <div className="flex flex-col pt-10 pl-4 w-full text-white main-page-content">
                <p className="text-center text-2xl font-bold mb-8">
                    Edit Election
                </p>
                <div>
                    <ElectionEditForm
                        onSubmitSuccess={() => window.location.reload}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminEditElectionPage;