import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded border p-6">
            <div className="mb-4 flex flex-col items-center">
              <div className="mb-4 h-24 w-24 rounded-full bg-surface"></div>
              <Button variant="outline" size="sm">Upload Photo</Button>
            </div>
            <nav className="space-y-2">
              {['Profile', 'Addresses', 'Payment Methods', 'Order History', 'Wishlist'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block rounded p-2 font-medium text-text hover:bg-gray-50"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded border p-6">
            <h2 className="mb-6 text-xl font-semibold">Personal Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text_dim">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full rounded border p-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text_dim">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full rounded border p-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text_dim">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text_dim">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full rounded border p-2"
                />
              </div>
              <Button className="bg-accent hover:bg-orange-600">Save Changes</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}