'use client';
import { IoLogoUsd } from "react-icons/io";
import type * as Prisma from '@prisma/client';

import Link from 'next/link';
// import { Button } from '@/app/ui/button';
// import { updateInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { updateProduct } from "@/app/lib/stock/actions";
import { useState } from "react";
import { CiApple, CiBadgeDollar, CiCalculator1, CiShoppingTag, CiTextAlignJustify } from 'react-icons/ci';

export default function EditProductForm({
  product,
  categories
}: {
  product: Prisma.Product
  categories: Prisma.ProductCategory[]
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
    <form action={dispatch} className='w-full'>
      <div className="rounded-md border border-border bg-tertiary p-4 md:p-6 shadow-sm">

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              defaultValue={product.description ?? ''}
              placeholder="Delicious potato..."
              className="
              peer
              block
              w-full
              rounded-md
              py-2 pl-10
              border
              bg-tertiary border-border
              "
              aria-describedby="description-error"
            />
            <CiTextAlignJustify className="text-2xl absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Product Price */}
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
                defaultValue={product.price/100}
                placeholder="Enter USD amount"
                className="bg-tertiary border-border peer block w-full rounded-md border py-2 pl-10"
                aria-describedby="price-error"
              />
              <CiBadgeDollar
                className="text-2xl absolute left-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        </div>
        <div id="amount-price" aria-live="polite" aria-atomic="true">
          {state.errors?.price &&
            state.errors.price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Product Stock */}
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
                placeholder="Enter stock amount"
                className="bg-tertiary border-border peer block w-full rounded-md border py-2 pl-10"
                aria-describedby="stock-error"
              />
              <CiCalculator1 className="text-2xl absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div id="stock-error" aria-live="polite" aria-atomic="true">
          {state.errors?.stock &&
            state.errors.stock.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/stock"
          className="flex h-10 items-center rounded-lg bg-muted/20 px-4 text-sm font-medium transition-colors hover:bg-muted/40"
        >
          Cancel
        </Link>
        <button onClick={() => setIsLoading(!isLoading)}>
          {isLoading ? 'Cargando...' : 'Edit Invoice'}
        </button>
      </div>
    </form>
  );
}
