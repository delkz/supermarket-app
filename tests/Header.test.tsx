import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Header from "../src/components/Header";
import { useRouter } from "next/router";

// Mock do next/router para evitar erros de navegação
jest.mock("next/router", () => ({
    useRouter: jest.fn(),
}));

describe("Header Component", () => {
    it("should render the navigation links correctly", () => {
        render(<Header />);

        // Verifica se os links estão presentes
        expect(screen.getByRole("link", { name: /📃 Listagem/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /📦 Novo produto/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /🗂️ Nova marca/i })).toBeInTheDocument();
    });

    it("should have correct href attributes for navigation links", () => {
        render(<Header />);

        // Verifica se os links possuem os hrefs corretos
        expect(screen.getByRole("link", { name: /📃 Listagem/i })).toHaveAttribute("href", "/");
        expect(screen.getByRole("link", { name: /📦 Novo produto/i })).toHaveAttribute("href", "/product/register");
        expect(screen.getByRole("link", { name: /🗂️ Nova marca/i })).toHaveAttribute("href", "/brand/register");
    });
});
