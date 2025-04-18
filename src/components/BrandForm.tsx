'use client'
import { Brand } from "@/types"
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormFeedback from "./FormFeedback";
type FormValues = Brand;

export default function BrandForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
    const [formMessage, setFormMessage] = useState<string>("");

    const onSubmit: SubmitHandler<FormValues> = async (values) =>  {

        const {name} = values;

        const raw = JSON.stringify({name});

        console.log({raw})

          const requestOptions = {
            method: "POST",
            body: raw,
          };

        const r = await fetch('/api/brands', requestOptions)
        const response = await r.json();

        if (r.ok) {
            setFormState("success");
            setFormMessage("Marca cadastrada com sucesso!");
        } else {
            setFormState("error");
            setFormMessage(response.message || "Ocorreu um erro ao cadastrar a marca.");
        }

        console.log({response});
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

        <button type="submit" className="btn btn-primary w-full">Cadastrar</button>

        {(formState !== "idle" && formMessage) &&  <FormFeedback text={formMessage} type={formState} />}
    </form>
    )
}

