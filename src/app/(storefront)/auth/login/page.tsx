import { CustomerLoginForm } from "@/components/auth/CustomerLoginForm";

export const dynamic = "force-dynamic";

export default function CustomerLoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <CustomerLoginForm />
    </div>
  );
}