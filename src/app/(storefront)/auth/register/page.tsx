import { CustomerRegisterForm } from "@/components/auth/CustomerRegisterForm";

export const dynamic = "force-dynamic";

export default function CustomerRegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <CustomerRegisterForm />
    </div>
  );
}