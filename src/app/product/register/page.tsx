import ProductForm from "@/components/ProductForm";


export default function RegisterPage() {


    return <main className="p-6 w-full container mx-auto">
         <h1 className="text-3xl font-bold mb-6">📦 Cadastrar novo produto</h1>
        <div className="form-control mb-6 ">
   
            <ProductForm method={"POST"} />
        </div>
    </main>
}