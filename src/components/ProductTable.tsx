'use client'

import { Product } from '@/types'
import Image from 'next/image'

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
            <th>Descrição</th>
            <th>Marca</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.description || '—'}</td>
              <td>{product.brand?.name || '—'}</td>
              <td>R$ {product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
