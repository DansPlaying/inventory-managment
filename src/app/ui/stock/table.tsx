import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { UpdateProduct } from './buttons';
import { fetchFilteredStock } from '@/app/lib/stock/data';

export default async function StockTable({
  query,
  currentPage,
  pageSize,
}: {
  query: string;
  currentPage: number;
  pageSize: number;
}) {
  const products = await fetchFilteredStock(query, currentPage, pageSize);
  if (!products.length) return (<h3>No products found</h3>)
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div
          className="rounded-lg md:pt-0 shadow-sm p-4"
          style={{ backgroundColor: 'var(--color-tertiary)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}
        >
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md p-4 border border-border bg-tertiary">
                <div className="flex items-center gap-4 pb-4">
                  <UpdateProduct id={`${product.id}`} />
                  <h3 className="text-2xl">{product.name}</h3>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className=''>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    <p>Stock {product.stock}</p>
                    <p>Last purchase {formatDateToLocal(product.updatedAt)}</p>
                  </div>
                  {/* <div className="flex justify-end gap-2">
                    <UpdateProduct id={`${product.id}`} />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Id
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Stock
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Last purchase
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                {/* <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th> */}
              </tr>
            </thead>
            <tbody className="">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b border-border text-sm last-of-type:border-none hover:bg-dark/50 transition-colors"
                >
                  {/* <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${product.name}'s profile picture`}
                      />
                      <p>{product.name}</p>
                    </div>
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-2">
                    {product.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {product.stock}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatDateToLocal(product.updatedAt)}
                    {/* {product.updatedAt} */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {product.category?.name || null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={`${product.id}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
