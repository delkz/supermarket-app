/* eslint-disable @next/next/no-img-element */
'use client'

import { Brand, Product } from "@/types"
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormFeedback from "./FormFeedback";
import { convertToBase64 } from "@/utils/convertToBase64";

interface FormValues extends Omit<Product, 'image'> {
    image: FileList | string;
}
  
interface ProductFormProps {
    method: "POST" | "PUT";
    productId ?: string;
}

interface requestParams {
    data: Brand[];
    page: number;
    totalPages: number;
    totalItems: number;
}

export default function ProductForm({method,productId}:ProductFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
    const [formMessage, setFormMessage] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        const fetchProduct = async ()=>{
            try {
                const res = await fetch(`/api/products/${productId}`);
                const product: Product = await res.json();
                reset({
                    name: product.name,
                    brandId: product.brandId,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                });
                setImagePreview(product.image || null); // Preenchemos a imagem aqui para visualização
            } catch (error) {
                console.error("Erro ao buscar produto", error);
            }
        }

        const fetchBrands = async () => {
            try {
                const res = await fetch(`/api/brands?page=1&limit=999`);
                const { data }: requestParams = await res.json();
                setBrands(data);
            } catch (error) {
                console.error("Erro ao buscar marcas", error);
            }
        };

        fetchBrands();

        if (method === "PUT" && productId) {
            fetchProduct();
        }
    }, []);





    const onSubmit: SubmitHandler<FormValues> = async (values) => {

         const isPost = method === "POST";
        setIsSubmitting(true);
        const { name, brandId, description, price, image } = values;

        let trueImage = image;

        if(!isPost &&  (!image || image.length === 0)) {
            trueImage = imagePreview || ""; // Se não houver nova imagem, mantenha a imagem atual
        }   

        if (isPost && (!image || image.length === 0)) {
            setFormState("error");
            setFormMessage("A imagem é obrigatória.");
            setIsSubmitting(false);
            return;
        }

        const raw = JSON.stringify({
            name,
            brandId,
            description,
            price,
            image : trueImage instanceof FileList ? await convertToBase64(trueImage[0]) : trueImage,
        });

        const requestOptions = {
            method,
            body: raw,
        };

        const url = isPost ? '/api/products' : `/api/products/${productId}`;

        const r = await fetch(url, requestOptions)
        const response = await r.json();

        setIsSubmitting(false);

        if (r.ok) {
            setFormState("success");
            setFormMessage("Produto cadastrado com sucesso!");
        
            reset({
                name: !isPost ? name : "",
                brandId:!isPost ? brandId : "",
                description: !isPost ? description : "",
                price: !isPost ? price : undefined,
                image: !isPost ? trueImage : undefined,
            });

            if (isPost) {
                setImagePreview(null);
            }
        
            
        } else {
            setFormState("error");
            setFormMessage(response.message || "Ocorreu um erro ao cadastrar o produto.");
        }

        // console.log({ response });
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
                        <label className="label" htmlFor="image" aria-labelledby="image">
                            <span className="label-text">Imagem do Produto</span>
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="file-input file-input-bordered w-full"
                            {...register("image", { required: method === "POST" ? "A imagem é obrigatória" : false})}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => setImagePreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {errors.image && <span className="text-error">{errors.image.message}</span>}
                        <div className="mt-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Pré-visualização da imagem"
                                    className="w-full h-64 object-scale-down bg-white"
                                />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : (method === "POST" ? "Cadastrar" : "Atualizar")}
            </button>

            {(formState !== "idle" && formMessage) && <FormFeedback text={formMessage} type={formState} />}

        </form>
    )
}