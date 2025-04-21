import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "../src/components/ProductForm";

describe("ProductForm Component", () => {
    const mockBrands = [
        { id: "1", name: "Marca 1" },
        { id: "2", name: "Marca 2" },
    ];

    beforeEach(() => {
        global.fetch = jest.fn((url) => {
            if (url.includes("/api/brands")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockBrands }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            });
        }) as jest.Mock;
    });

    it("should render the form fields correctly", async () => {
        render(<ProductForm method="POST" />);

        // Verifica se os campos estão presentes
        expect(screen.getByPlaceholderText("Digite o nome")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Digite o preço")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Digite a descrição")).toBeInTheDocument();
        expect(screen.getByText("Selecione uma marca")).toBeInTheDocument();
        expect(screen.getByText("Imagem do Produto")).toBeInTheDocument();

        // Aguarda o carregamento das marcas
        await waitFor(() => {
            expect(screen.getByText("Marca 1")).toBeInTheDocument();
            expect(screen.getByText("Marca 2")).toBeInTheDocument();
        });
    });

    it("should show validation errors when submitting empty form", async () => {
        render(<ProductForm method="POST" />);

        // Clica no botão de enviar sem preencher o formulário
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se as mensagens de erro são exibidas
        expect(await screen.findByText("O nome é obrigatório")).toBeInTheDocument();
        expect(await screen.findByText("O preço é obrigatório")).toBeInTheDocument();
        expect(await screen.findByText("A descrição é obrigatória")).toBeInTheDocument();
        expect(await screen.findByText("A marca é obrigatória")).toBeInTheDocument();
        expect(await screen.findByText("A imagem é obrigatória.")).toBeInTheDocument();
    });

    it("should show success message on successful submission", async () => {
        render(<ProductForm method="POST" />);

        // Preenche os campos do formulário
        fireEvent.change(screen.getByPlaceholderText("Digite o nome"), {
            target: { value: "Produto Teste" },
        });
        fireEvent.change(screen.getByPlaceholderText("Digite o preço"), {
            target: { value: "99.99" },
        });
        fireEvent.change(screen.getByPlaceholderText("Digite a descrição"), {
            target: { value: "Descrição do Produto Teste" },
        });
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "1" },
        });

        // Atualiza para buscar o campo de upload de imagem pelo ID associado ao label
        const fileInput = screen.getByLabelText("Imagem do Produto");
        const file = new File(["image"], "image.png", { type: "image/png" });
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        // Clica no botão de enviar
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se a mensagem de sucesso é exibida
        expect(await screen.findByText("Produto cadastrado com sucesso!")).toBeInTheDocument();
    });

    it("should show error message on failed submission", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Erro ao cadastrar o produto." }),
            })
        ) as jest.Mock;

        render(<ProductForm method="POST" />);

        // Preenche os campos do formulário
        fireEvent.change(screen.getByPlaceholderText("Digite o nome"), {
            target: { value: "Produto Teste" },
        });
        fireEvent.change(screen.getByPlaceholderText("Digite o preço"), {
            target: { value: "99.99" },
        });
        fireEvent.change(screen.getByPlaceholderText("Digite a descrição"), {
            target: { value: "Descrição do Produto Teste" },
        });
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "1" },
        });
        const file = new File(["image"], "image.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText("Imagem do Produto"), {
            target: { files: [file] },
        });

        // Clica no botão de enviar
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

        // Verifica se a mensagem de erro é exibida
        expect(await screen.findByText("Erro ao cadastrar o produto.")).toBeInTheDocument();
    });
});
