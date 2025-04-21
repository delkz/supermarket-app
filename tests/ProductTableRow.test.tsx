import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import ProductTableRow from "../src/components/ProductTableRow";
import { Product } from "@/types";

describe("ProductTableRow Component", () => {
    const mockProduct: Product = {
        id: 1,
        name: "Produto Teste",
        description: "Descrição do Produto Teste",
        brand: { id: 1, name: "Marca Teste" },
        price: 99.99,
        image: "https://via.placeholder.com/150",
    };

    it("should render product details correctly", () => {
        render(<ProductTableRow product={mockProduct} />);

        // Verifica se o nome do produto está presente
        expect(screen.getByText("Produto Teste")).toBeInTheDocument();

        // Verifica se a descrição está presente
        expect(screen.getByText("Descrição do Produto Teste")).toBeInTheDocument();

        // Verifica se a marca está presente
        expect(screen.getByText("Marca Teste")).toBeInTheDocument();

        // Verifica se o preço está formatado corretamente
        expect(screen.getByText("R$ 99.99")).toBeInTheDocument();
    });

    it("should render product image if available", () => {
        render(<ProductTableRow product={mockProduct} />);

        // Verifica se a imagem do produto está presente
        const image = screen.getByAltText("Produto Teste");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", mockProduct.image);
    });

    it("should render placeholder if image is not available", () => {
        const productWithoutImage = { ...mockProduct, image: "" };
        render(<ProductTableRow product={productWithoutImage} />);

        // Verifica se o placeholder está presente
        expect(screen.getByText("—")).toBeInTheDocument();
    });

    it("should render a link to view the product details", () => {
        render(<ProductTableRow product={mockProduct} />);

        // Verifica se o link para detalhes do produto está presente
        const link = screen.getByRole("link", { name: /ver/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", `/product/${mockProduct.id}`);
    });
});
