interface FormFeedbackProps {
    text: string;
    type: "success" | "error";
}
export default function FormFeedback({ text, type }: FormFeedbackProps) {

    const isSuccess = type === "success";

    const successSvg = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>)
    const errorSvg = (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>)

    return (
        <div role="alert" className={`alert ${isSuccess ? "alert-success" : 'alert-error'} alert-soft`}>
            {isSuccess ? successSvg : errorSvg}
            <span>{text}</span>
        </div>
    );

    

}