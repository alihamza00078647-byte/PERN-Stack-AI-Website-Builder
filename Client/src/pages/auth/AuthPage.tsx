import { useParams } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";

export default function AuthPage() {
    const {pathname} = useParams();

    return (
        <main className="flex flex-col items-center justify-center p-6 h-[80vh] mt-10 mb-15 text-white">
            <AuthView pathname={pathname} classNames={{base: 'bg-black/10 ring ring-indigo-900'}} />
        </main>
    )
}