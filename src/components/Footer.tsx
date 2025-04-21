import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-base-200">
            <nav className="navbar">
                <ul className="menu menu-horizontal flex-col md:flex-row px-1 p-6 w-full container mx-auto">
                    <li><Link href="/" className="btn btn-ghost">🏠 Inicio</Link></li>
                    <li><Link target="_blank" title="Github" href="https://github.com/delkz/supermarket-app" className="btn btn-ghost">ℹ️ Github</Link></li>
                    <li><Link target="_blank" title="Delkz" href="https://delkz.vercel.app/" className="btn btn-ghost">📞 Contato</Link></li>
                </ul>
            </nav>
        </footer>
    );
}