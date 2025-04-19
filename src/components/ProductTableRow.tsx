'use client'

import { Product } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { memo } from "react"

const ProductTableRow = memo(({ product }: { product: Product }) => {
    return (
        <tr key={product.id}>
        <td>
          {product.image ? (
            <Image
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-scale-down rounded bg-white"
            unoptimized
            width={16}
            height={16}
            />
          ) : (
            <span className="text-gray-400"></span>
          )}
        </td>
        <td>{product.name}</td>
        <td className='hidden md:table-cell'><p className='line-clamp-2'>{product.description || '—'}</p></td>
        <td className='hidden sm:table-cell'>{product.brand?.name || '—'}</td>
        <td>R$ {product.price.toFixed(2)}</td>
        <td>
          <Link href={`/product/${product.id}`} className="btn btn-sm btn-block">Ver</Link>
        </td>
      </tr>
    )
})
ProductTableRow.displayName = 'ProductTableRow';
export default ProductTableRow;