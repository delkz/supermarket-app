import ProductDeleteButton from "@/components/ProductDeleteButton";
import ProductForm from "@/components/ProductForm";


export default async function ProdutPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {

    const { id } = await params;

    // const response = await fetch('/api/products/').then((res) => res.json());

    // console.log({response});


    return <main className="p-6 w-full container mx-auto">
        <h1 className="text-3xl font-bold mb-6">📦 Editar produto</h1>

        <div className="form-control mb-6 ">
            <ProductForm method={"PUT"} productId={id} />
            <ProductDeleteButton productId={id}/>
        </div>
    </main>
}