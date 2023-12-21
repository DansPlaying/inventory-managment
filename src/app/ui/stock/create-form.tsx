'use client'

import type * as Prisma from '@prisma/client';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { CiApple, CiBadgeDollar, CiCalculator1, CiShoppingTag, CiTextAlignJustify } from 'react-icons/ci';

import { Button } from '../components/button';
import { State, createProduct } from '@/app/lib/stock/actions';

export default function CreateForm({ categories }: { categories: Prisma.ProductCategory[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createProduct, initialState)
  return (
    <form action={dispatch} className='w-full'>
      <div className="rounded-md border p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
        
                placeholder="Potato, Tomato, Rice..."
                className="
                peer
                block
                w-full
                rounded-md
                py-2 pl-10
                border
                dark:bg-dark
                "
                aria-describedby="name-error"
              />
              <CiApple
                className="text-2xl absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
          
                placeholder="Delicious potato..."
                className="
                peer
                block
                w-full
                rounded-md
                py-2 pl-10
                border
                dark:bg-dark
                "
                aria-describedby="description-error"
              />
              <CiTextAlignJustify className="text-2xl absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
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
                placeholder="Enter USD amount"
                className="dark:bg-dark peer block w-full rounded-md border py-2 pl-10"
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
                placeholder="Enter stock amount"
                className="dark:bg-dark peer block w-full rounded-md border py-2 pl-10"
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

        {/* Product Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category **
          </label>
          <div className="relative">
            <select
              id="category"
              name="categoryId"
              className="dark:bg-dark peer block w-full cursor-pointer rounded-md border py-2 pl-10"
              defaultValue=""
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <CiShoppingTag className="text-2xl absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div id="category-error" aria-live="polite" aria-atomic="true">
          {state.errors?.categoryId &&
            state.errors.categoryId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/stock"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
