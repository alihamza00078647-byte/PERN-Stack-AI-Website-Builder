import { AccountSettingsCards } from "@daveyplate/better-auth-ui";

export default function Setting() {
  return (
    <div className="w-full p-4 flex items-center justify-center min-h-[90vh]">
      <div className="w-full max-w-3xl">
        <AccountSettingsCards
          classNames={{
            card: {
              base: "bg-black/10 ring ring-indigo-950 max-w-xl mx-auto",
              footer: "bg-black/10 ring ring-indigo-950",
            },
          }}
        />
      </div>
    </div>
  );
}
