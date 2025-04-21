import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import FormFeedback from "../src/components/FormFeedback";

describe("FormFeedback Component", () => {
    it("should render success feedback correctly", () => {
        render(<FormFeedback text="Operação realizada com sucesso!" type="success" />);

        // Verifica se o texto está presente
        expect(screen.getByText("Operação realizada com sucesso!")).toBeInTheDocument();

        // Verifica se o ícone de sucesso está presente
        expect(screen.getByRole("alert")).toHaveClass("alert-success");
    });

    it("should render error feedback correctly", () => {
        render(<FormFeedback text="Ocorreu um erro." type="error" />);

        // Verifica se o texto está presente
        expect(screen.getByText("Ocorreu um erro.")).toBeInTheDocument();

        // Verifica se o ícone de erro está presente
        expect(screen.getByRole("alert")).toHaveClass("alert-error");
    });
});
