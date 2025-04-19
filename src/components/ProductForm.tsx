/* eslint-disable @next/next/no-img-element */
'use client'
import { Product, Brand } from "@/types"
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormFeedback from "./FormFeedback";
type FormValues = Product;

interface requestParams {
    data: Brand[];
    page: number;
    totalPages: number;
    totalItems: number;
}

export default function ProductForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [brands, SetBrands] = useState<Brand[]>([]);
    const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
    const [formMessage, setFormMessage] = useState<string>("");

    useEffect(() => {
        const fetchBrands = async () => {
            const res = await fetch(`/api/brands?page=1&limit=999`);
            const { data }: requestParams = await res.json();
            SetBrands(data);
        };

        fetchBrands();
    }, [])


    const onSubmit: SubmitHandler<FormValues> = async (values) => {

        const { name, brandId, description, price, image } = values;

        if (!image || image.length === 0) {
            alert("Selecione uma imagem");
            return;
        }

        let base64Image = "";

        const file = image[0];
        base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });


        const raw = JSON.stringify({ name, brandId, description, price, image: base64Image });

        const requestOptions = {
            method: "POST",
            body: raw,
        };

        const r = await fetch('/api/products', requestOptions)
        const response = await r.json();

        if (r.ok) {
            setFormState("success");
            setFormMessage("Produto cadastrado com sucesso!");
        } else {
            setFormState("error");
            setFormMessage(response.message || "Ocorreu um erro ao cadastrar o produto.");
        }


        console.log({ response });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Nome do Produto</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Digite o nome"
                            className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                            {...register("name", { required: "O nome é obrigatório" })}
                        />
                        {errors.name && <span className="text-error">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Preço</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Digite o preço"
                            className={`input input-bordered w-full ${errors.price ? "input-error" : ""}`}
                            {...register("price", { required: "O preço é obrigatório", valueAsNumber: true })}
                        />
                        {errors.price && <span className="text-error">{errors.price.message}</span>}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Descrição</span>
                        </label>
                        <textarea
                            placeholder="Digite a descrição"
                            className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
                            {...register("description", { required: "A descrição é obrigatória" })}
                        />
                        {errors.description && <span className="text-error">{errors.description.message}</span>}
                    </div>


                    <div>
                        <label className="label">
                            <span className="label-text">Marca</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.brandId ? "select-error" : ""}`}
                            {...register("brandId", { required: "A marca é obrigatória" })}
                        >
                            <option value="">Selecione uma marca</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                        {errors.brandId && <span className="text-error">{errors.brandId.message}</span>}
                    </div>

                </div>
                <div>
                    <div>
                        <label className="label">
                            <span className="label-text">Imagem do Produto</span>
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="file-input file-input-bordered w-full"
                            {...register("image", { required: "A imagem é obrigatória" })}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        const preview = document.getElementById("image-preview") as HTMLImageElement;
                                        if (preview) {
                                            preview.src = reader.result as string;
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {errors.image && <span className="text-error">{errors.image.message}</span>}
                        <div className="mt-4">

                            <img
                                id="image-preview"
                                alt="Pré-visualização da imagem"
                                className="w-full h-64 object-scale-down bg-white"
                                style={{ display: "none" }}
                                onLoad={(e) => (e.currentTarget.style.display = "block")}
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">Cadastrar</button>

            {(formState !== "idle" && formMessage) && <FormFeedback text={formMessage} type={formState} />}

        </form>
    )
}