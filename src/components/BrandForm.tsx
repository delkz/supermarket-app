'use client'

import { Brand } from "@/types"
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormFeedback from "./FormFeedback";

type FormValues = Brand;

export default function BrandForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>();

    const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
    const [formMessage, setFormMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsSubmitting(true);

        const raw = JSON.stringify({ name: values.name });

        try {
            const r = await fetch('/api/brands', {
                method: "POST",
                body: raw,
            });

            const response = await r.json();

            if (r.ok) {
                setFormState("success");
                setFormMessage("Marca cadastrada com sucesso!");
                reset();
            } else {
                setFormState("error");
                setFormMessage(response.message || "Ocorreu um erro ao cadastrar a marca.");
            }
        } catch {
            setFormState("error");
            setFormMessage("Erro de rede ou servidor. Tente novamente.");
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="label">
                    <span className="label-text">Nome da marca</span>
                </label>
                <input
                    type="text"
                    placeholder="Digite o nome"
                    className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                    {...register("name", { required: "O nome é obrigatório" })}
                />
                {errors.name && <span className="text-error">{errors.name.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Cadastrar"}
            </button>

            {(formState !== "idle" && formMessage) && (
                <FormFeedback text={formMessage} type={formState} />
            )}
        </form>
    )
}
