import Link from "next/link";
import { CiCirclePlus, CiEdit } from "react-icons/ci";

export function CreateProduct() {
  return (
    <Link
      href="/dashboard/stock/create"
      className="
      fixed bottom-4 right-4 md:static
      flex
      gap-2
      bg-accentPrimary
      text-white p-4 md:px-4 md:py-2 rounded-md font-semibold
      items-center
      transition-colors
      hover:bg-purple-700
     "
    >
      <span className="hidden md:block">Add Product</span>{' '}
      <CiCirclePlus className='text-2xl' />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/stock/${id}/edit`}
      className="text-2xl rounded-md border border-accentPrimary p-2 hover:bg-accentPrimary hover:text-white transition-colors"
    >
      <CiEdit />
    </Link>
  );
}