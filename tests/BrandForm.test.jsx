import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react";
import BrandForm from "../src/components/BrandForm";

describe("BrandForm Component", () => {
    it("should render the form correctly", () => {
        render(<BrandForm />);

        // Verifica se o campo de entrada e o botão estão presentes
        expect(screen.getByPlaceholderText("Digite o nome")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
    });

    it("should show validation error when submitting empty form", async () => {
        render(<BrandForm />);

        // Clica no botão de enviar sem preencher o formulário
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se a mensagem de erro é exibida
        expect(await screen.findByText("O nome é obrigatório")).toBeInTheDocument();
    });

    it("should show success message on successful submission", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );

        render(<BrandForm />);

        // Preenche o campo de entrada
        fireEvent.change(screen.getByPlaceholderText("Digite o nome"), {
            target: { value: "Nova Marca" },
        });

        // Clica no botão de enviar
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se a mensagem de sucesso é exibida
        expect(await screen.findByText("Marca cadastrada com sucesso!")).toBeInTheDocument();

        // Verifica se o campo foi limpo após o envio
        expect(screen.getByPlaceholderText("Digite o nome")).toHaveValue("");
    });

    it("should show error message on failed submission", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Erro ao cadastrar." }),
            })
        );

        render(<BrandForm />);

        // Preenche o campo de entrada
        fireEvent.change(screen.getByPlaceholderText("Digite o nome"), {
            target: { value: "Nova Marca" },
        });

        // Clica no botão de enviar
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se a mensagem de erro é exibida
        expect(await screen.findByText("Erro ao cadastrar.")).toBeInTheDocument();
    });
});
