import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import ProductTable from "../src/components/ProductTable";

describe("ProductTable Component", () => {
    const mockProducts = [
        {
            id: 1,
            name: "Produto 1",
            description: "Descrição do Produto 1",
            brand: "Marca 1",
            price: 10.99,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Produto 2",
            description: "Descrição do Produto 2",
            brand: "Marca 2",
            price: 20.99,
            image: "https://via.placeholder.com/150",
        },
    ];

    it("should render the table headers correctly", () => {
        render(<ProductTable products={mockProducts} />);

        // Verifica se os cabeçalhos da tabela estão presentes
        expect(screen.getByText("Imagem")).toBeInTheDocument();
        expect(screen.getByText("Nome")).toBeInTheDocument();
        expect(screen.getByText("Descrição")).toBeInTheDocument();
        expect(screen.getByText("Marca")).toBeInTheDocument();
        expect(screen.getByText("Preço")).toBeInTheDocument();
    });

    it("should render the correct number of rows", () => {
        render(<ProductTable products={mockProducts} />);

        // Verifica se o número de linhas corresponde ao número de produtos
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(mockProducts.length + 1); // +1 para o cabeçalho
    });

    it("should render product details correctly", () => {
        render(<ProductTable products={mockProducts} />);

        // Verifica se os detalhes dos produtos estão presentes
        mockProducts.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByText(product.description)).toBeInTheDocument();
            expect(screen.getByText(product.brand)).toBeInTheDocument();
            expect(screen.getByText(`R$ ${product.price.toFixed(2)}`)).toBeInTheDocument();
        });
    });
});
