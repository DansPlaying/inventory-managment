import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { UpdateProduct } from './buttons';
import { fetchFilteredStock } from '@/app/lib/stock/data';

const products = [
  {
    id: '1',
    name: 'Papa',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'papitas rufles',
    price: 100,
    stock: 10,
    category: 'food',
  },
  {
    id: '2',
    name: 'Harina',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'harina pan',
    price: 200,
    stock: 10,
    category: 'food',
  },
  {
    id: '3',
    name: 'Tomate',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'tomate rojo',
    price: 50,
    stock: 10,
    category: 'food',
  },
  {
    id: '4',
    name: 'Cebolla',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'cebolla de cabeza',
    price: 100,
    stock: 10,
    category: 'food',
  },
];

export default async function StockTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredStock(query, currentPage);
  if (!products.length) return (<h3>No products found</h3>)
  return (
    <div className="flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md p-4 border">
                <div className="flex items-center justify-between pb-4">
                  <h3 className="text-2xl">{product.name}</h3>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className=''>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    <p>Stock {product.stock}</p>
                    <p>Last purchase {formatDateToLocal(product.createdAt)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={`${product.id}`} />
                  </div>
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
                  // className="w-full border-b py-6 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  className="w-full border-b text-sm last-of-type:border-none"
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
                    {formatDateToLocal(product.createdAt)}
                    {/* {product.updatedAt} */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {product.category}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={`${product.id}`} />
                    </div>
                  </td>

                  {/* <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={product.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={product.id} />
                      <DeleteInvoice id={product.id} />
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
