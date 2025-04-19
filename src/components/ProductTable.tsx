'use client'

import { Product } from '@/types'
import ProductTableRow from './ProductTableRow'

interface Props {
  products: Product[]
}

export default function ProductTable({ products }: Props) {
  return (
    <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th className='hidden md:table-cell'>Descrição</th>
            <th className='hidden sm:table-cell'>Marca</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <ProductTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
