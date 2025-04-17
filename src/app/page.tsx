'use client'

import { useEffect, useState } from 'react'
import ProductTable from '@/components/ProductTable'
import { Product } from '@/types'

interface requestParams {
  data: Product[],
  hasNextPage: boolean,
  total: number,
  page: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)


  const updateValues = (data: Product[], hasNextPage: boolean, page: number) => {
    setProducts(data)
    setLoading(false)
    setHasNextPage(hasNextPage)
    setPage(page)
  }

  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true)
    const params = new URLSearchParams({
      search: search || '',
      page: pageNumber.toString(),
      limit: '5'
    }).toString()
    const res = await fetch(`/api/products?${params}`)
    const { data, hasNextPage, page }: requestParams = await res.json()
    updateValues(pageNumber === 1 ? data : [...products, ...data], hasNextPage, page)
  }

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchProducts(page + 1)
    }
  }

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Lista de Produtos</h1>

      <div className="form-control mb-6 w-full max-w-sm">
        <input
          type="text"
          placeholder="Buscar por nome, descrição ou marca..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Carregando produtos...</div>
      ) : (
        <ProductTable products={products} />
      )}
      
      {hasNextPage && <button onClick={handleLoadMore} className='btn btn-primary mt-6'>Carregar mais produtos</button>}
    </main>
  )
}
