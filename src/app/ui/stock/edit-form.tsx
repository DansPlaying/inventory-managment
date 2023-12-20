'use client';
import { IoLogoUsd } from "react-icons/io";
import { Product } from '@prisma/client';
import Link from 'next/link';
// import { Button } from '@/app/ui/button';
// import { updateInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { updateProduct } from "@/app/lib/stock/actions";
import { useState } from "react";


export default function EditProductForm({
  product
}: {
  product: Product

}) {
  const initialState = { message: '', errors: {} };
  const [isLoading, setIsLoading] = useState(false)

  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, dispatch] = useFormState(updateProductWithId, initialState);
  if (state.message.length > 0) {
    if (isLoading) {
      setIsLoading(false)
    }
  }
  return (
    <form action={dispatch} className=' pr-[4%] flex-col justify-center items-center align-middle'>
      <div className="rounded-md  bg-transparent border border-white p-2 md:p-4">

        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              defaultValue={product.name}
              placeholder="Enter product name"
              className="peer block w-full rounded-md border bg-transparent py-2 pl-6 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              defaultValue={product.description ?? ''}
              placeholder="Delicious..."
              className="peer block w-full rounded-md border bg-transparent py-2 pl-6 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border bg-transparent border-gray-200 py-2 pl-9 text-sm  outline-2 placeholder:text-gray-500"
              />
              <IoLogoUsd className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stock
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="stock"
                name="stock"
                type="number"
                step="0.01"
                defaultValue={product.stock}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border bg-transparent border-gray-200 py-2 pl-9 text-sm  outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/stock"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button type="submit" onClick={() => setIsLoading(!isLoading)}>
          {isLoading ? 'Cargando...' : 'Edit Invoice'}
        </button>
        {/* <Button type="submit"></Button> */}
      </div>
    </form>
  );
}
