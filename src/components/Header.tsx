import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-base-200 ">
            <nav className="navbar">
            <ul className="menu menu-horizontal flex-col md:flex-row px-1 p-6 w-full container mx-auto">
                <li><Link href="/" className="btn btn-ghost">📃 Listagem</Link></li>
                <li><Link href="/product/register" className="btn btn-ghost">📦 Novo produto</Link></li>
                <li><Link href="/brand/register" className="btn btn-ghost">🗂️ Nova marca</Link></li>
            </ul>
            </nav>
        </header>
    )
}