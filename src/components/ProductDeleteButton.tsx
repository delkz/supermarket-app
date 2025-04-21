'use client';

const ProductDeleteButton = (product: {
    productId: string | number | { productId: string | number };
}) => {

    const id = product.productId || product;

    function handleDeleteProduct() {
        const confirmation = confirm("Você tem certeza que deseja deletar este produto?");
        if (!confirmation) return;

       fetch('/api/products/'+ id, {
            method: 'DELETE',
        }).then((res) => {
            if (res.ok) {
                alert("Produto deletado com sucesso!");
                window.location.href = "/";
            } else {
                alert("Erro ao deletar produto.");
            }
        })   

    }

    return (<button className="mt-6 btn btn-outline btn-error w-full" onClick={handleDeleteProduct}>Deletar produto</button>)
}

export default ProductDeleteButton;